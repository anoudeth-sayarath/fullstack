import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Dynamic Navigation layer injection point */}
      <Navbar />
      
      {/* Target Route View Container Context */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}