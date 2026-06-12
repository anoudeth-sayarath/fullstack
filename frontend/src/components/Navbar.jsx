import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    // 🧻 Complete session variable teardown
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    
    // Redirect to entry gate point
    navigate('/login');
  };

  // Helper function to check active state styling
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-800 border-b border-gray-700/60 sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Core MediaSpace Identity Logo branding */}
        <Link to="/feed" className="flex items-center space-x-2 group">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-md group-hover:bg-indigo-500 transition">
            M
          </div>
          <span className="font-extrabold tracking-tight text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            MediaSpace
          </span>
        </Link>

        {/* Center Application Path Action Selection Links */}
        <div className="flex items-center space-x-2">
          <Link 
            to="/feed" 
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              isActive('/feed') 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            Timeline Feed
          </Link>
          
          <Link 
            to="/profile" 
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              isActive('/profile') 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            My Profile
          </Link>
        </div>

        {/* Right Controlled Interface Layout Element Blocks */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-400 font-medium">Logged in as</p>
            <p className="text-sm font-bold text-indigo-400 font-mono">@{username}</p>
          </div>
          
          <hr className="hidden sm:block h-8 w-[1px] border-0 bg-gray-700" />

          <button 
            onClick={handleLogout}
            className="bg-gray-700/50 hover:bg-red-950/40 border border-gray-600/30 hover:border-red-500/30 text-gray-300 hover:text-red-400 px-4 py-2 rounded-xl text-sm font-bold transition duration-200"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}