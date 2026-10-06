import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {rankQuestions, findAnswer} from '../src/features/assistant/search.mjs';
const dataset=fs.readFileSync(new URL('../public/Bitopi_KPI_QA_RAG.jsonl',import.meta.url),'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
test('partial and Roman Bangla input suggests bilingual dataset questions',()=>{
  assert.ok(rankQuestions(dataset,'smar','bn').some(({record})=>/SMART/i.test(record.metadata.question)));
  const questions=rankQuestions(dataset,'ojon','bn');
  assert.ok(questions.length); assert.ok(questions.every(({record})=>record.metadata.lang==='bn'));
  assert.equal(new Set(questions.map(({record})=>record.metadata.qa_id)).size,questions.length);
  assert.equal(rankQuestions(dataset,'zzzzzzzzzz','bn').length,0);
});
test('suggested questions retrieve exact answers, even after switching UI language',()=>{
  for(const lang of ['bn','en']) for(const {record} of rankQuestions(dataset,'weight',lang)) {
    assert.equal(findAnswer(dataset,record.metadata.question,lang).metadata.answer,record.metadata.answer);
  }
  assert.equal(findAnswer(dataset,'What is a KPI?','bn').metadata.lang,'bn');
  assert.ok(findAnswer(dataset,'what is kpi weight','en'));
});
