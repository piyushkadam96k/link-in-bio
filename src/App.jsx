import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicProfile from './pages/PublicProfile';
import Editor from './pages/Editor';
import Login from './pages/Login';
import { RequireAuth } from './components/auth/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './hooks/useProfileData';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Routes>
          <Route path="/" element={<PublicProfile />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/edit"
            element={
              <RequireAuth>
                <Editor />
              </RequireAuth>
            }
          />
          <Route path="/:username" element={<PublicProfile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
