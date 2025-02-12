// src/App.js
import React from 'react';
import RoutesPage from './RoutesPage';
import GymLeadersPage from './GymLeadersPage';
import TeamPlannerPage from './TeamPlannerPage';

function App() {
  return (
    <div className="App">
      <h1>Nuzlocke Tracker</h1>
      <RoutesPage />
      <GymLeadersPage />
      <TeamPlannerPage />
    </div>
  );
}

export default App;
