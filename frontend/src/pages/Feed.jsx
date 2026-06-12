import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [success] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadInitialFeed() {
      try {
        const response = await fetch("http://localhost:8000/api/posts/");
        const data = await response.json();
        if (response.ok && isMounted) {
          setPosts(data);
        }
      } catch {
        console.error("Failed to load timeline stream");
      }
    }

    loadInitialFeed();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Core Control Dashboard Application Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              MediaSpace Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Real-time synchronized data publishing workspace
            </p>
          </div>
        </div>
        {success && (
          <p className="text-green-400 bg-green-900/30 p-3 rounded-xl text-sm border border-green-500/20">
            {success}
          </p>
        )}

        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 p-6 rounded-2xl border border-gray-700/30 shadow-md hover:border-gray-700/60 transition duration-200 space-y-4"
            >
              {/* Account Metadata Header Box */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center font-black text-white text-md shadow-md">
                  {post.author_details?.username
                    ? post.author_details.username[0].toUpperCase()
                    : "?"}
                </div>
                <div>
                  <h4 className="font-bold text-indigo-400 hover:text-indigo-300 transition cursor-pointer">
                    @{post.author_details?.username || "unknown"}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Narrative Body Blocks */}
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-gray-100">
                  {post.title}
                </h2>
                <p className="text-gray-300 text-md leading-relaxed whitespace-pre-wrap break-words">
                  {post.content}
                </p>
              </div>

              {/* Render Attached Image Assets Dynamically */}
              {post.image && (
                <div className="overflow-hidden rounded-xl bg-gray-900 border border-gray-700/40 max-h-96 shadow-inner">
                  <img
                    src={post.image}
                    alt="Stream upload payload file"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Detail View Redirection Anchor links */}
              <div className="pt-2 border-t border-gray-700/30">
                <Link
                  to={`/users/${post.author_details?.username || "unknown"}/posts/${post.id}`}
                  className="text-xs text-indigo-400 hover:underline transition font-mono"
                >
                  Inspect Item Blueprint &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
