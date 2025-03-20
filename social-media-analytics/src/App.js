import React from 'react';
import './App.css';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <DataProvider>
      <div className="App">
        <header className="App-header">
          <h1>Social Media Analytics</h1>
        </header>
        <main>
          {/* Your components will go here */}
          <p>Ready to build your social media analytics dashboard!</p>
        </main>
      </div>
    </DataProvider>
  );
}

export default App;