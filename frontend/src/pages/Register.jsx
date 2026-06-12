import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', bio: '' });
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('profile.bio', formData.bio);
    if (avatar) data.append('profile.avatar', avatar);

    try {
      const response = await fetch('http://localhost:8000/api/register/', { method: 'POST', body: data });
      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', result.access);
        localStorage.setItem('refresh_token', result.refresh);
        localStorage.setItem('username', result.username);
        navigate('/feed');
      } else {
        setError(JSON.stringify(result));
      }
    } catch {
      setError('Connection to server failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full space-y-4">
        <h2 className="text-3xl font-bold text-center text-indigo-500">Create Account</h2>
        {error && <p className="text-red-400 bg-red-900/30 p-3 rounded text-sm break-words">{error}</p>}
        <input type="text" placeholder="Username" required className="w-full p-3 bg-gray-700 rounded" onChange={e => setFormData({...formData, username: e.target.value})} />
        <input type="email" placeholder="Email" className="w-full p-3 bg-gray-700 rounded" onChange={e => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" required className="w-full p-3 bg-gray-700 rounded" onChange={e => setFormData({...formData, password: e.target.value})} />
        <textarea placeholder="Bio description..." className="w-full p-3 bg-gray-700 rounded h-24" onChange={e => setFormData({...formData, bio: e.target.value})} />
        <input type="file" accept="image/*" className="text-sm text-gray-400" onChange={e => setAvatar(e.target.files[0])} />
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 p-3 rounded font-semibold">Sign Up</button>
        <p className="text-center text-sm text-gray-400">Have an account? <Link to="/login" className="text-indigo-400 underline">Login</Link></p>
      </form>
    </div>
  );
}