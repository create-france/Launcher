import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { login } from '../modules/auth/Account';

function MainPage() {
  return (
    <div>
      <h1>Hello World!</h1>
      <button
        type="button"
        onClick={() => {
          login();
        }}
      >
        Click Me
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}
