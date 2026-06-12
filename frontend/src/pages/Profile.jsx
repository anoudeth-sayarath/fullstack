import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  //  Dialog/Modal States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null); // null = Create, UUID = Update
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null); // Updated state name for clarity

  const token = localStorage.getItem('access_token');

  // Helper utility to identify video links from media URLs dynamically
  const isVideoUrl = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  //  1. Lifecycle Synchronizer
  useEffect(() => {
    let isMounted = true;

    async function loadProfileAndPosts() {
      if (!token) {
        if (isMounted) setError("Active session credentials not found.");
        return;
      }

      try {
        const profileRes = await fetch('http://localhost:8000/api/accounts/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileJson = await profileRes.json();

        const postsRes = await fetch('http://localhost:8000/api/posts/');
        const postsJson = await postsRes.json();

        if (profileRes.ok && postsRes.ok && isMounted) {
          setProfileData(profileJson);
          const personalPosts = postsJson.filter(
            post => post.author_details?.username === profileJson.username
          );
          setMyPosts(personalPosts);
        }
      } catch {
        console.error("Failed to load secure profile stream architecture.");
      }
    }

    loadProfileAndPosts();

    return () => { isMounted = false; };
  }, [token]);

  //  2. Isolated Re-fetcher
  const refreshPersonalPosts = async (currentUsername) => {
    if (!currentUsername) return;
    try {
      const response = await fetch('http://localhost:8000/api/posts/');
      const data = await response.json();
      if (response.ok) {
        const personalPosts = data.filter(
          post => post.author_details?.username === currentUsername
        );
        setMyPosts(personalPosts);
      }
    } catch {
      console.error("Error updating personal timeline vectors.");
    }
  };

  // 3. Modal Opener Controllers
  const openCreateDialog = () => {
    setEditingPostId(null);
    setTitle('');
    setContent('');
    setMediaFile(null);
    setError('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setMediaFile(null); // Keep previous item unless a new file is specified
    setError('');
    setIsDialogOpen(true);
  };

  // 4. Submit Handler (Handles BOTH Create & Update actions seamlessly)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('title', title);
    data.append('content', content);
    
    // Append file payload dynamically to the backend target parameter key
    if (mediaFile) {
      data.append('image', mediaFile); 
    }

    const isEditing = editingPostId !== null;
    const url = isEditing 
      ? `http://localhost:8000/api/users/${profileData.username}/posts/${editingPostId}/`
      : 'http://localhost:8000/api/posts/';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (response.status === 429) {
        setError('Rate Limit reached! Please slow down your requests.');
        return;
      }

      if (response.ok) {
        setSuccess(isEditing ? 'Post updated successfully!' : 'Post created successfully!');
        setIsDialogOpen(false); 
        await refreshPersonalPosts(profileData.username);
      } else {
        const errJson = await response.json();
        setError(JSON.stringify(errJson));
      }
    } catch {
      setError('Server connection pipeline failure.');
    }
  };

  // 5. Delete Entry Action Handler
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete this post entry?")) return;
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:8000/api/users/${profileData.username}/posts/${postId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess('Post permanently deleted from space layers.');
        await refreshPersonalPosts(profileData.username);
      } else {
        setError('Failed to clear targeting item framework from server.');
      }
    } catch {
      setError('Network infrastructure dropped verification payload.');
    }
  };

  if (!profileData && !error) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center font-mono">Resolving user schema matrix...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb bar */}
        <div className="flex justify-between items-center bg-gray-800/40 border border-gray-800 p-4 rounded-xl">
          <Link to="/feed" className="text-sm text-indigo-400 hover:underline flex items-center space-x-1">
            <span>&larr; Back to Global Timeline</span>
          </Link>
          <span className="text-xs font-mono text-gray-500">Secure Management Panel</span>
        </div>

        {/* USER PROFILE CARD HEADER */}
        <div className="bg-gradient-to-r from-gray-800 to-indigo-950 p-8 rounded-2xl border border-gray-700/40 shadow-2xl flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="h-24 w-24 rounded-full bg-indigo-600 border-4 border-indigo-500 shadow-xl overflow-hidden flex items-center justify-center text-4xl font-black text-white flex-shrink-0">
            {profileData?.profile?.avatar ? (
              <img src={profileData.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              profileData?.username ? profileData.username[0].toUpperCase() : '?'
            )}
          </div>
          <div className="flex-1 text-center md:text-left space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">@{profileData?.username || 'User'}</h1>
            <p className="text-indigo-400 font-medium text-sm">{profileData?.email || 'No email attached'}</p>
            <p className="text-gray-300 max-w-2xl text-sm leading-relaxed whitespace-pre-wrap break-words">
              {profileData?.profile?.bio || "No profile bio description defined yet."}
            </p>
          </div>
        </div>

        {/* Status Alerts Notification Rails */}
        {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-xl text-sm border border-red-500/20 break-words">{error}</p>}
        {success && <p className="text-green-400 bg-green-900/30 p-3 rounded-xl text-sm border border-green-500/20">{success}</p>}

        {/* CRUD POST MANAGEMENT STREAM DASHBOARD */}
        <div className="bg-gray-800 border border-gray-700/40 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-100">Content Engine Dashboard</h2>
              <p className="text-xs text-gray-400">Manage, edit, or terminate post matrix layers</p>
            </div>
            <button 
              onClick={openCreateDialog}
              className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/20 flex items-center space-x-2 self-start sm:self-auto"
            >
              <span>+ Create Post</span>
            </button>
          </div>

          {/* TABLE LAYOUT DICTIONARY LIST */}
          <div className="overflow-x-auto rounded-xl border border-gray-700/30">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-700/40">
                  <th className="p-4">Post Context Entry</th>
                  <th className="p-4 hidden sm:table-cell">Attached Preview</th>
                  <th className="p-4 hidden md:table-cell">Published Timestamp</th>
                  <th className="p-4 text-right">Administrative Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30 text-sm">
                {myPosts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">No active posts managed under this profile ecosystem.</td>
                  </tr>
                ) : (
                  myPosts.map(post => (
                    <tr key={post.id} className="hover:bg-gray-700/20 transition duration-150">
                      <td className="p-4 max-w-xs sm:max-w-sm">
                        <div className="font-bold text-gray-200 line-clamp-1">{post.title}</div>
                        <div className="text-xs text-gray-400 line-clamp-1 mt-0.5">{post.content}</div>
                      </td>
                      
                      {/*  DYNAMIC MEDIA PREVIEW CELL */}
                      <td className="p-4 hidden sm:table-cell">
                        {(post.image || post.video) ? (
                          <div className="h-12 w-20 rounded-lg overflow-hidden bg-gray-900 border border-gray-700/60 flex items-center justify-center">
                            {isVideoUrl(post.image || post.video) ? (
                              <video src={post.image || post.video} className="w-full h-full object-cover muted" preload="metadata" />
                            ) : (
                              <img src={post.image || post.video} alt="Attached Preview" className="w-full h-full object-cover" />
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-gray-600">None</span>
                        )}
                      </td>

                      <td className="p-4 text-xs text-gray-400 hidden md:table-cell">
                        {new Date(post.created_at).toLocaleString()}
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <button 
                          onClick={() => openEditDialog(post)}
                          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/40 border border-red-500/20 px-3 py-1.5 rounded-lg transition"
                        >
                          Delete
                        </button>
                        <Link 
                          to={`/users/${profileData.username}/posts/${post.id}`}
                          className="text-xs font-bold text-gray-400 hover:text-gray-200 bg-gray-700/40 border border-gray-600/20 px-3 py-1.5 rounded-lg transition inline-block text-center"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ====================  OVERLAY POP-UP CRITICAL MODAL DIALOG ==================== */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 max-w-xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 bg-gray-900/60 border-b border-gray-700/50 flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-tight text-gray-100">
                {editingPostId ? '🔧 Modify Post Reference Entry' : '📝 Broadcast New Post Content'}
              </h3>
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-400 hover:text-white transition text-lg font-bold font-mono px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Post Title</label>
                <input type="text" placeholder="Title" required value={title}
                  className="w-full p-3 bg-gray-700/60 border border-gray-600/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-200"
                  onChange={e => setTitle(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Content Details</label>
                <textarea placeholder="Write full text details here..." required value={content}
                  className="w-full p-3 bg-gray-700/60 border border-gray-600/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-gray-200 h-40 resize-none"
                  onChange={e => setContent(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Attach Media Asset {editingPostId && '(Leave blank to retain original asset)'}
                </label>
                <div className="bg-gray-700/30 border border-gray-600/30 rounded-xl p-3 text-center">
                  {/* Modified to accept both images and videos */}
                  <input 
                    type="file" 
                    accept="image/*,video/*" 
                    className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-900/50 file:text-indigo-400 hover:file:bg-indigo-900 transition w-full cursor-pointer"
                    onChange={e => setMediaFile(e.target.files[0])} 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700/50 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-indigo-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}