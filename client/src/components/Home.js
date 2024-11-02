import React from 'react';

const Home = () => (
  <div>
    <h1>Welcome to the Numerical Methods Calculator</h1>
    <p>Select a method from the navigation bar to get started.</p>
    <button onClick={() => window.open("http://localhost:5000/logs", "_blank")}>
      View Server Logs
    </button>
  </div>
);

export default Home;
