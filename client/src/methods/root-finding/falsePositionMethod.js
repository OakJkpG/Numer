export function falsePositionMethod(funcStr, a, b, tolerance) {
  const f = (x) => eval(funcStr.replace(/x/g, `(${x})`));
  const results = [];
  let iteration = 0;

  // Check if initial interval is valid
  if (f(a) * f(b) >= 0) {
    return 'The function has the same signs at the endpoints.';
  }

  let error = tolerance + 1;
  let x = a; // Initialize x with the starting point

  while (error > tolerance) {
    // Apply the false-position formula
    const fA = f(a);
    const fB = f(b);
    
    // Avoid division by zero
    if (fB === fA) {
      return 'Error: Division by zero in false position formula.';
    }
    
    x = (a * fB - b * fA) / (fB - fA);
    const fX = f(x);

    results.push({
      iteration,
      x,
      y: fX,
      error: Math.abs(fX), // Error should reflect the value of f(x)
    });

    // Check for convergence
    if (fX === 0) break;
    else if (fX * fA < 0) {
      b = x; // Update b
    } else {
      a = x; // Update a
    }

    error = Math.abs(f(b) - f(a)); // Update error
    iteration++;

    // Check for maximum iterations to avoid infinite loops
    if (iteration > 1000) {
      return 'Error: Exceeded maximum iterations without convergence.';
    }
  }

  return results;
}
