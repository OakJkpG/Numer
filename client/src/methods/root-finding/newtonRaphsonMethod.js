export function newtonRaphsonMethod(funcStr, derivativeStr, initialGuess, tolerance) {
  const f = (x) => eval(funcStr.replace(/x/g, `(${x})`));
  const fPrime = (x) => eval(derivativeStr.replace(/x/g, `(${x})`));
  const results = [];
  let x0 = initialGuess;
  let error = tolerance + 1;
  let iteration = 0;

  while (error > tolerance) {
    const fVal = f(x0);
    const fPrimeVal = fPrime(x0);
    const x1 = x0 - fVal / fPrimeVal;
    error = Math.abs(x1 - x0);

    results.push({
      iteration,
      x: x1,
      y: f(x1),
      error,
    });

    x0 = x1;
    iteration++;
  }

  return results;
}
