import React, { useState } from 'react';
import { cramerRule } from '../methods/Linear-algebra/cramerRule'; // Adjust path as necessary

const LinearFinder = () => {
  const [matrixSize, setMatrixSize] = useState(2);
  const [matrix, setMatrix] = useState(Array.from({ length: 2 }, () => Array(2).fill(0)));
  const [b, setB] = useState(Array(2).fill(0));
  const [results, setResults] = useState(null);

  const handleMatrixChange = (row, col, value) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = parseFloat(value) || 0; // Ensure numerical input
    setMatrix(newMatrix);
  };

  const handleBChange = (index, value) => {
    const newB = [...b];
    newB[index] = parseFloat(value) || 0; // Ensure numerical input
    setB(newB);
  };

  const solveCramersRule = () => {
    // Call the Cramer's Rule function
    const results = cramerRule(matrix, b);
    setResults(results);
  };

  return (
    <div>
      <h2>Cramer's Rule Solver</h2>
      <div>
        <label>
          Matrix Size:
          <input
            type="number"
            value={matrixSize}
            min={1}
            onChange={(e) => {
              const newSize = parseInt(e.target.value);
              setMatrixSize(newSize);
              setMatrix(Array.from({ length: newSize }, () => Array(newSize).fill(0)));
              setB(Array.from({ length: newSize }, () => 0));
            }}
          />
        </label>
      </div>

      <h3>Matrix A:</h3>
      {Array.from({ length: matrixSize }).map((_, row) => (
        <div key={row}>
          {Array.from({ length: matrixSize }).map((_, col) => (
            <input
              key={col}
              type="number"
              placeholder={`a[${row}][${col}]`}
              onChange={(e) => handleMatrixChange(row, col, e.target.value)}
            />
          ))}
        </div>
      ))}

      <h3>Vector B:</h3>
      {Array.from({ length: matrixSize }).map((_, index) => (
        <input
          key={index}
          type="number"
          placeholder={`b[${index}]`}
          onChange={(e) => handleBChange(index, e.target.value)}
        />
      ))}

      <button onClick={solveCramersRule}>Calculate</button>

      {results && (
        <div>
          <h3>Results</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LinearFinder;
