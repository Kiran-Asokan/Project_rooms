import Home from './Components/Home'
import LoginPage from './Components/LoginPage'
import './App.css';
import { Routes, Route } from "react-router-dom";

function App() {
 
  return (
    <div className="App">
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
