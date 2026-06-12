import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('username', username);
        navigate('/feed');
      } else {
        setError('Invalid credentials.');
      }
    } catch {
      setError('Server connection unavailable.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm w-full space-y-4">
        <h2 className="text-3xl font-bold text-center text-indigo-500">Log In</h2>
        {error && <p className="text-red-400 bg-red-900/30 p-3 rounded text-sm text-center">{error}</p>}
        <input type="text" placeholder="Username" required className="w-full p-3 bg-gray-700 rounded" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" required className="w-full p-3 bg-gray-700 rounded" onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 p-3 rounded font-semibold">Log In</button>
        <p className="text-center text-sm text-gray-400">New? <Link to="/register" className="text-indigo-400 underline">Register here</Link></p>
      </form>
    </div>
  );
}