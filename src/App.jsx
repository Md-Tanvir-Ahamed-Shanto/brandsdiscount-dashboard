import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Old from './Updated dashboard v11';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<h1>404</h1>} />
        <Route path='/old' element={<Old />} />
      </Routes>
    </BrowserRouter>
  )}

export default App
