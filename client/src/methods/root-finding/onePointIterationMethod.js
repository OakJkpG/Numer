export function onePointIterationMethod(funcStr, initialGuess, tolerance, maxIterations = 100) {
  const g = (x) => eval(funcStr.replace(/x/g, `(${x})`));
  const results = [];
  let x = initialGuess;
  let iteration = 0;
  let error = tolerance + 1;

  while (error > tolerance && iteration < maxIterations) {
    const xNew = g(x);
    error = Math.abs(xNew - x);

    results.push({
      iteration,
      x: xNew,
      y: g(xNew),
      error: error.toFixed(6),
    });

    x = xNew;
    iteration++;
  }

  // If no convergence within the maximum iterations, return a message
  if (iteration === maxIterations) {
    return 'Method did not converge within the maximum number of iterations';
  }

  return results;
}
