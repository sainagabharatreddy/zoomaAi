
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Ai from './Ai';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Ai />} />
          <Route path="/ai" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
