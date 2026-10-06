export const departments = [
  'HR & Admin',
  'Industrial Engineering',
  'CAD & Sample',
  'Commercial',
  'Engineering & Services',
  'ERP & IT',
  'Finance & Accounts',
  'General',
  'HR, Admin & Compliance',
  'MIS & Internal Audit',
  'Production',
  'Production Planning & control',
  'QA, Audit & Technical',
  'Store & Warehouse',
  'Technical',
  'Washing',
  'Design & Product Development',
  'ESG',
  'Marketing & Merchandising',
  'Supply Chain',
  'IE',
];
export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export function score(k, e) {
  if (!e || e.status === 'Pending' || e.status === 'No Input') return null;
  let target =
    e.override === '' || e.override == null
      ? Number(k.target)
      : Number(e.override);
  if (e.policy === 'Workload Adjusted' && e.approved)
    target = Math.min(target, Number(e.eligible));
  const a = Number(e.achievement);
  if (a < 0 || target < 0) return null;
  let p =
    k.direction === 'HIGH'
      ? target > 0
        ? a / target
        : null
      : a === 0
        ? 1
        : target / a;
  if (p === null) return null;
  return { performance: p * 100, score: Math.min(5, p * 5), target };
}
export function summary(ks, year, month) {
  let assigned = ks.reduce((a, k) => a + Number(k.weight), 0),
    valid = ks
      .map((k) => ({ k, s: score(k, k.entries[`${year}-${month}`]) }))
      .filter((x) => x.s),
    weight = valid.reduce((a, x) => a + Number(x.k.weight), 0);
  return {
    assigned,
    coverage: assigned ? (weight / assigned) * 100 : 0,
    performance: weight
      ? valid.reduce((a, x) => a + x.s.performance * Number(x.k.weight), 0) /
        weight
      : null,
    score: weight
      ? valid.reduce((a, x) => a + x.s.score * Number(x.k.weight), 0) / weight
      : null,
  };
}
export function seed() {
  return departments.flatMap((dept, i) =>
    [0, 1].map((j) => ({
      id: `KPI-${String(i * 2 + j + 1).padStart(3, '0')}`,
      dept,
      kra: j ? 'Service quality' : 'Operational excellence',
      mo: j ? 'Reduce turnaround time' : 'Deliver planned output',
      title: j
        ? 'Complete department requests within 3 days'
        : 'Deliver 100% of approved monthly work',
      perspective: j ? 'Customer' : 'Process',
      weight: 50,
      threshold: 4.5,
      requirements:
        'Approved workload, department records and team availability',
      direction: j ? 'LOW' : 'HIGH',
      unit: j ? 'Day' : 'Percent',
      baseline: j ? 5 : 80,
      target: j ? 3 : 100,
      actions: [
        {
          text: 'Review workload and identify dependencies',
          owner: 'Department lead',
          due: '2026-10-10',
          status: 'Completed',
          remarks: '',
        },
        {
          text: 'Execute and track approved activities',
          owner: 'Team member',
          due: '2026-10-20',
          status: 'In progress',
          remarks: '',
        },
        {
          text: 'Review results and submit evidence',
          owner: 'Department lead',
          due: '2026-10-30',
          status: 'Pending',
          remarks: '',
        },
      ],
      entries: {
        '2026-0': {
          status: 'Reported',
          achievement: j ? 3.2 : 87 + (i % 9),
          remarks: 'Illustrative sample',
          override: '',
          policy: 'Fixed',
          eligible: '',
          approved: false,
        },
        '2026-1': {
          status: 'Reported',
          achievement: j ? 2.8 : 92 + (i % 9),
          remarks: 'Illustrative sample',
          override: '',
          policy: 'Fixed',
          eligible: '',
          approved: false,
        },
      },
    })),
  );
}
