import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import DashboardPage from './pages/DashboardPage';
import FormPage from './pages/FormPage';
import FormBuilderPage from './pages/FormBuilderPage';
import FormViewerPage from './pages/FormViewerPage';
import ResponsesListPage from './pages/ResponsesListPage';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/airtable/callback" element={<OAuthCallbackPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/form/builder" element={<ProtectedRoute><FormBuilderPage /></ProtectedRoute>} />
        <Route path="/form/:id" element={<ProtectedRoute><FormPage /></ProtectedRoute>} />
        <Route path="/forms/:formId" element={<FormViewerPage />} />
        <Route path="/forms/:formId/responses" element={<ProtectedRoute><ResponsesListPage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}