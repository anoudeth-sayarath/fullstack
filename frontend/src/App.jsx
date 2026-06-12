import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; //  Import Layout core wrapper

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*  Unauthenticated Guest Gate Open Paths */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/*  Secure Authenticated Workspace Route Matrices */}
        <Route path="/feed" element={
          <ProtectedRoute>
            <Layout><Feed /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        } />


        {/* Catchall Routing Parameter Logic Mapping */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
}