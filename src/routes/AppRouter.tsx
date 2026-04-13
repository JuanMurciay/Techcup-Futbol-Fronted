import type { ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import OrganizerDashboard from '../pages/dashboard/OrganizerDashboard';
import StandingsPage from '../pages/tournaments/StandingsPage';
import MatchesPage from '../pages/matches/MatchesPage';
import MatchDetailPage from '../pages/matches/MatchDetailPage';
import TeamsPage from '../pages/teams/TeamsPage';
import TeamDetailPage from '../pages/teams/TeamDetailPage';
import CreateTeamPage from '../pages/teams/CreateTeamPage';
import PlayerProfilePage from '../pages/players/PlayerProfilePage';

function ProtectedRoute({ children, roles }: { children: ReactElement; roles?: string[] }) {
  const raw = localStorage.getItem('tc_user');
  if (!raw) return <Navigate to="/login" replace />;
  const user = JSON.parse(raw);
  if (roles && !roles.includes(user.role)) return <Navigate to="/standings" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/organizer/dashboard" element={
          <ProtectedRoute roles={['ORGANIZADOR']}>
            <OrganizerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/standings" element={
          <ProtectedRoute>
            <StandingsPage />
          </ProtectedRoute>
        } />

        <Route path="/matches" element={
          <ProtectedRoute>
            <MatchesPage />
          </ProtectedRoute>
        } />

        <Route path="/matches/:id" element={
          <ProtectedRoute>
            <MatchDetailPage />
          </ProtectedRoute>
        } />

        <Route path="/teams" element={
          <ProtectedRoute>
            <TeamsPage />
          </ProtectedRoute>
        } />

        <Route path="/teams/create" element={
          <ProtectedRoute roles={['CAPITAN']}>
            <CreateTeamPage />
          </ProtectedRoute>
        } />

        <Route path="/teams/:id" element={
          <ProtectedRoute>
            <TeamDetailPage />
          </ProtectedRoute>
        } />

        <Route path="/players/:id" element={
          <ProtectedRoute>
            <PlayerProfilePage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}