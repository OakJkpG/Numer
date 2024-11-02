export function secantMethod(funcStr, x0, x1, tolerance, maxIterations = 100) {
  const f = (x) => eval(funcStr.replace(/x/g, `(${x})`));
  const results = [];
  let iteration = 0;
  let error = tolerance + 1;

  while (error > tolerance && iteration < maxIterations) {
    const fX0 = f(x0);
    const fX1 = f(x1);
    const xNew = x1 - (fX1 * (x1 - x0)) / (fX1 - fX0);

    error = Math.abs(xNew - x1);

    results.push({
      iteration,
      x: xNew,
      y: f(xNew),
      error: error.toFixed(6),
    });

    // Update points for the next iteration
    x0 = x1;
    x1 = xNew;
    iteration++;
  }

  // Check if max iterations were reached without convergence
  if (iteration === maxIterations) {
    return 'Method did not converge within the maximum number of iterations';
  }

  return results;
}
