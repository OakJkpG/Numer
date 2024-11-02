import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { bisectionMethod } from '../methods/root-finding/bisectionMethod';
import { falsePositionMethod } from '../methods/root-finding/falsePositionMethod';
import { graphicalMethod } from '../methods/root-finding/graphicalMethod';
import { newtonRaphsonMethod } from '../methods/root-finding/newtonRaphsonMethod';
import { onePointIterationMethod } from '../methods/root-finding/onePointIterationMethod';
import { secantMethod } from '../methods/root-finding/secantMethod';
import log from 'loglevel';

const RootFinder = () => {
  const [method, setMethod] = useState('Graphical Method');
  const [xStart, setXStart] = useState(1);
  const [xEnd, setXEnd] = useState(10);
  const [errorThreshold, setErrorThreshold] = useState(0.001);
  const [functionInput, setFunctionInput] = useState('x*x-4');
  const [initialGuess, setInitialGuess] = useState(1); // for Newton-Raphson and One-Point Iteration
  const [result, setResult] = useState(null);
  const [points, setPoints] = useState([]);

  const logToServer = async (message) => {
    try {
      await fetch('http://localhost:5000/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }), // Send the log message
      });
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  };

  const handleCalculate = () => {
    const logMessage = `Calculating with inputs: ${method}, ${xStart}, ${xEnd}`;
    console.log(logMessage); // Log to browser console
    logToServer(logMessage); // Send log to server
    let output;
  
    try {
      // Validate that xStart and xEnd are different and that the function has different signs
      const f = (x) => eval(functionInput.replace(/x/g, `(${x})`));
      if (xStart === xEnd) {
        throw new Error('xStart and xEnd must be different values.');
      }
      if (f(xStart) * f(xEnd) >= 0) {
        throw new Error('The function has the same signs at the endpoints.');
      }
  
      if (method === 'bisection') {
        output = bisectionMethod(functionInput, xStart, xEnd, errorThreshold);
      } else if (method === 'false-position') {
        output = falsePositionMethod(functionInput, xStart, xEnd, errorThreshold);
      } else if (method === 'newton') {
        output = newtonRaphsonMethod(functionInput, '2*x', initialGuess, errorThreshold); // Example derivative
      } else if (method === 'one-point') {
        output = onePointIterationMethod(functionInput, initialGuess, errorThreshold);
      } else if (method === 'secant') {
        output = secantMethod(functionInput, xStart, xEnd, errorThreshold);
      } else if (method === 'graphical') {
        const { results, points: graphPoints } = graphicalMethod(functionInput, xStart, xEnd, errorThreshold);
        output = results;
        setPoints(graphPoints);
      }
  
      // If output is an error message, handle it
      if (typeof output === 'string') {
        setResult([{ iteration: 0, x: null, y: null, error: output }]);
        setPoints([]);
      } else {
        setResult(output);
        setPoints(output.map((step) => ({ x: step.x, y: step.y })));
      }
  
    } catch (error) {
      setResult([{ iteration: 0, x: null, y: null, error: error.message }]);
      setPoints([]);
    }
  };
  

  return (
    <div>
      <h2>Root Finder</h2>
      <select onChange={(e) => setMethod(e.target.value)} value={method}>
        <option value="graphical">Graphical Method</option>
        <option value="bisection">Bisection Method</option>
        <option value="false-position">False-Position Method</option>
        <option value="newton">Newton-Raphson Method</option>
        <option value="one-point">One-Point Iteration Method</option>
        <option value="secant">Secant Method</option>
      </select>
      <div>
        <label>
          Function f(x):
          <input
            type="text"
            placeholder="Enter function, e.g., x*x - 4"
            value={functionInput}
            onChange={(e) => setFunctionInput(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          x Start:
          <input
            type="number"
            placeholder="x Start"
            value={xStart}
            onChange={(e) => setXStart(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          x End:
          <input
            type="number"
            placeholder="x End"
            value={xEnd}
            onChange={(e) => setXEnd(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Error Threshold:
          <input
            type="number"
            placeholder="Error Threshold"
            value={errorThreshold}
            onChange={(e) => setErrorThreshold(parseFloat(e.target.value))}
          />
        </label>
      </div>

      {method === 'newton' || method === 'one-point' ? (
        <div>
          <label>
            Initial Guess:
            <input
              type="number"
              placeholder="Initial Guess"
              value={initialGuess}
              onChange={(e) => setInitialGuess(parseFloat(e.target.value))}
            />
          </label>
        </div>
      ) : null}

      <div>
        <label>
          Calculate:
          <button onClick={handleCalculate}>Calculate</button>
        </label>
      </div>

      {result && (
  <div>
    <h3>Results</h3>
    <table>
      <thead>
        <tr>
          <th>Iteration</th>
          <th>X</th>
          <th>Y</th>
          <th>Error</th>
        </tr>
      </thead>
      <tbody>
        {result.map((step, index) => (
          <tr key={index}>
            <td>{step.iteration}</td>
            <td>{step.x !== null ? step.x.toFixed(4) : 'N/A'}</td>
            <td>{step.y !== null ? step.y.toFixed(4) : 'N/A'}</td>
            <td>{typeof step.error === 'number' ? step.error.toFixed(4) : step.error}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}



      <Plot
        data={[
          {
            x: points.map((point) => point.x),
            y: points.map((point) => point.y),
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'blue' },
            name: 'f(x)',
          },
        ]}
        layout={{ width: 720, height: 480, title: 'Graph of f(x)' }}
      />
    </div>
  );
};

export default RootFinder;
