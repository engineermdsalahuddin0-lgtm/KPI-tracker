const aliases = {
  ojon: 'weight', ojôn: 'weight', gurutto: 'weight', weight: 'weight', weights: 'weight', wight: 'weight',
  ওজন: 'weight', গুরুত্ব: 'weight', বণ্টন: 'weight', বরাদ্দ: 'weight',
  lokkho: 'target', target: 'target', লক্ষ্য: 'target', লক্ষ্যমাত্রা: 'target',
  অর্জন: 'achievement', achievement: 'achievement', অর্জনের: 'achievement',
  smart: 'smart', স্মার্ট: 'smart', kra: 'kra', কেআরএ: 'kra', kpi: 'kpi', কেপিআই: 'kpi',
  baseline: 'baseline', বেসলাইন: 'baseline', threshold: 'threshold', থ্রেশহোল্ড: 'threshold',
  score: 'score', স্কোর: 'score', স্কোরের: 'score', performance: 'performance', কর্মদক্ষতা: 'performance',
};
const stop = new Set(['what','is','a','an','the','how','to','of','for','and','do','does','can','i','my','me','tell','about','ki','kivabe','kibhabe','amar','ta','কী','কি','একটি','কিভাবে','কীভাবে','আমার','করে','করব','করতে','হয়','হবে','কত','কেন']);
export const normalize = (text) => String(text || '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}\p{M}]+/gu, ' ').trim();
const tokens = (text) => normalize(text).split(/\s+/).filter((x) => x && !stop.has(x)).map((x) => aliases[x] || x);

export function rankQuestions(dataset, query, language = 'bn', limit = 5) {
  const grouped = new Map();
  for (const record of dataset) {
    if (!record.metadata?.question || !record.metadata?.answer) continue;
    const id = record.metadata.qa_id || record.id;
    const group = grouped.get(id) || [];
    group.push(record); grouped.set(id, group);
  }
  const input = tokens(query);
  const normalized = normalize(query);
  const ranked = [...grouped.values()].map((records, index) => {
    let rank = 0;
    for (const record of records) {
      const question = normalize(record.metadata.question);
      const qt = tokens(record.metadata.question);
      const at = tokens(record.metadata.answer + ' ' + (record.metadata.department || ''));
      let value = input.reduce((sum, token) => sum + (qt.includes(token) ? 8 : qt.some((x) => x.startsWith(token) && token.length >= 2) ? 5 : at.includes(token) ? 1 : 0), 0);
      if (normalized && question === normalized) value += 100;
      else if (normalized && question.includes(normalized)) value += 12;
      rank = Math.max(rank, value);
    }
    const record = records.find((r) => r.metadata.lang === language) || records[0];
    return { record, rank, index };
  });
  return ranked.filter((x) => !normalized || x.rank >= 3).sort((a, b) => b.rank - a.rank || a.index - b.index).slice(0, limit);
}

export function findAnswer(dataset, query, language = 'bn') {
  return rankQuestions(dataset, query, language, 1)[0]?.record || null;
}
