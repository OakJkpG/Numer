import React from 'react';

const Home = () => {
  const serverLogsUrl = process.env.REACT_APP_SERVER_LOGS_URL;

  return (
    <div>
      <h1>Welcome to the Numerical Methods Calculator</h1>
      <p>Select a method from the navigation bar to get started.</p>
      <button onClick={() => window.open(serverLogsUrl, "_blank")}>
        View Server Logs
      </button>
    </div>
  );
};

export default Home;
