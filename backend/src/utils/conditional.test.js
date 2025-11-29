const { shouldShowQuestion } = require('./conditional');

function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    console.error('FAIL:', msg, ' expected=', expected, ' got=', actual);
    process.exitCode = 2;
    throw new Error('Test failed');
  }
}

// simple data setup
const answers = {
  role: 'Engineer',
  skills: ['react', 'node'],
  bio: 'I build things',
};

// rules tests
assertEqual(
  shouldShowQuestion(null, answers),
  true,
  'null rules should show'
);

assertEqual(
  shouldShowQuestion({ logic: 'AND', conditions: [{ questionKey: 'role', operator: 'equals', value: 'Engineer' }] }, answers),
  true,
  'AND single true'
);

assertEqual(
  shouldShowQuestion({ logic: 'AND', conditions: [{ questionKey: 'role', operator: 'equals', value: 'Designer' }] }, answers),
  false,
  'AND single false'
);

assertEqual(
  shouldShowQuestion({ logic: 'OR', conditions: [{ questionKey: 'role', operator: 'equals', value: 'Designer' }, { questionKey: 'skills', operator: 'contains', value: 'node' }] }, answers),
  true,
  'OR with contains true'
);

assertEqual(
  shouldShowQuestion({ logic: 'AND', conditions: [{ questionKey: 'skills', operator: 'contains', value: 'node' }, { questionKey: 'bio', operator: 'contains', value: 'build' }] }, answers),
  true,
  'AND with string contains true'
);

console.log('All conditional tests passed');
