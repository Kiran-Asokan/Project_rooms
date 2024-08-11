import Home from './Components/Home'
import LoginPage from './Components/LoginPage'
import './App.css';
import { Routes, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute/PrivateRoute';

function App() {
 
  return (
    <div className="App">
      <Routes>
          <Route path='/' element={
            <PrivateRoute>
              <Home/>
            </PrivateRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
