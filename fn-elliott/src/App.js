import './App.css';
import Home from './components/Homepage';
import Graph from './components/Graphpage';
import Header from './components/Header';

import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";

function App() {
  return (
    <div>
      <Header/>
      <Router>
        <Routes>
            <Route exact path="/" element={<Home />}/>
            <Route path="/graph/:stock_name" element={<Graph />}/>
        </Routes>
      </Router>
    </div>

  );
}

export default App;
