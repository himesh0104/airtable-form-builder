function evalCondition(cond, answers) {
  const { questionKey, operator, value } = cond || {};
  const actual = answers?.[questionKey];

  switch (operator) {
    case 'equals':
      return actual === value;
    case 'notEquals':
      return actual !== value;
    case 'contains':
      if (actual == null) return false;
      if (Array.isArray(actual)) return actual.includes(value);
      if (typeof actual === 'string') return actual.includes(String(value));
      return false;
    default:
      return false;
  }
}

export function shouldShowQuestion(rules, answersSoFar) {
  if (!rules) return true;
  const { logic = 'AND', conditions = [] } = rules;
  if (!conditions.length) return true;

  const results = conditions.map(c => {
    try {
      return !!evalCondition(c, answersSoFar);
    } catch (e) {
      return false;
    }
  });

  if (logic === 'OR') return results.some(Boolean);
  return results.every(Boolean);
}
