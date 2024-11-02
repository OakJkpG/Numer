// methods/Linear-algebra/cramerRule.js
export const cramerRule = (matrix, b) => {
  const n = matrix.length; // Assuming square matrix
  const results = new Array(n);

  // Calculate determinant of the main matrix
  const determinant = (matrix) => {
    if (matrix.length === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    let det = 0;
    for (let i = 0; i < matrix.length; i++) {
      const subMatrix = matrix.slice(1).map(row => row.filter((_, colIndex) => colIndex !== i));
      det += (i % 2 === 0 ? 1 : -1) * matrix[0][i] * determinant(subMatrix);
    }
    return det;
  };

  const detA = determinant(matrix);
  if (detA === 0) return 'Determinant is zero, no unique solution exists.';

  // Calculate each variable using Cramer's Rule
  for (let i = 0; i < n; i++) {
    const tempMatrix = matrix.map((row, rowIndex) => {
      if (rowIndex === i) return b; // Replace the i-th column with vector b
      return row;
    });
    results[i] = determinant(tempMatrix) / detA;
  }

  return results;
};
