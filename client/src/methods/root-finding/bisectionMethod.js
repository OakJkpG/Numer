export function bisectionMethod(funcStr, a, b, tolerance) {
  const f = (x) => eval(funcStr.replace(/x/g, `(${x})`));
  const results = [];
  let iteration = 0;

  if (f(a) * f(b) >= 0) {
    return 'The function has the same signs at the endpoints.';
  }

  let mid = a;
  let error = Math.abs(b - a);

  while (error > tolerance) {
    mid = (a + b) / 2;
    const fMid = f(mid);

    results.push({
      iteration,
      x: mid,
      y: fMid,
      error,
    });

    if (fMid === 0) break;
    else if (fMid * f(a) < 0) b = mid;
    else a = mid;

    error = Math.abs(b - a);
    iteration++;
  }

  return results;
}
