export function graphicalMethod(funcStr, xStart, xEnd, tolerance) {
  const f = (x) => eval(funcStr.replace(/x/g, `(${x})`));
  const results = [];
  const points = [];

  for (let x = xStart; x <= xEnd; x += 0.1) {
    const y = f(x);
    points.push({ x, y });
    if (Math.abs(y) < tolerance) {
      results.push({
        iteration: results.length,
        x,
        y,
        error: Math.abs(y), // Ensure error is a number
      });
    }
  }

  // If no results were found, return an empty array with a meaningful structure
  if (results.length === 0) {
    return [{ iteration: 0, x: null, y: null, error: 'No roots found within the range' }];
  }

  return { results, points };
}
