import type { ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import CaptainTeamOnboardingPage from '../pages/onboarding/CaptainTeamOnboardingPage';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import OrganizerDashboard from '../pages/dashboard/OrganizerDashboard';
import PlayerDashboard from '../pages/dashboard/PlayerDashboard';
import CaptainDashboard from '../pages/dashboard/CaptainDashboard';
import RefereeDashboard from '../pages/dashboard/RefereeDashboard';
import StandingsPage from '../pages/tournaments/StandingsPage';
import MatchesPage from '../pages/matches/MatchesPage';
import MatchDetailPage from '../pages/matches/MatchDetailPage';
import TeamsPage from '../pages/teams/TeamsPage';
import TeamDetailPage from '../pages/teams/TeamDetailPage';
import CreateTeamPage from '../pages/teams/CreateTeamPage';
import PlayerProfilePage from '../pages/players/PlayerProfilePage';
import RefereeReportsPage from '../pages/referee/RefereeReportsPage';
import { normalizeRole } from '../utils/roles';

function ProtectedRoute({ children, roles }: { children: ReactElement; roles?: string[] }) {
  const raw = localStorage.getItem('tc_user');
  if (!raw) return <Navigate to="/login" replace />;
  const user = JSON.parse(raw) as { role?: string };
  const normalized = normalizeRole(user.role ?? '');
  if (roles && !roles.includes(normalized)) return <Navigate to="/" replace />;
  return children;
}

function RoleHomeRedirect() {
  const raw = localStorage.getItem('tc_user');
  if (!raw) return <Navigate to="/login" replace />;
  const user = JSON.parse(raw) as { role?: string };
  const r = normalizeRole(user.role ?? '');
  if (r === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (r === 'ORGANIZER') return <Navigate to="/organizer/dashboard" replace />;
  if (r === 'CAPTAIN') return <Navigate to="/captain/dashboard" replace />;
  if (r === 'REFEREE') return <Navigate to="/referee/dashboard" replace />;
  return <Navigate to="/player/dashboard" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleHomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/create-team" element={<CaptainTeamOnboardingPage />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute roles={['ORGANIZER']}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/player/dashboard"
          element={
            <ProtectedRoute roles={['PLAYER']}>
              <PlayerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/captain/dashboard"
          element={
            <ProtectedRoute roles={['CAPTAIN']}>
              <CaptainDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/referee/dashboard"
          element={
            <ProtectedRoute roles={['REFEREE']}>
              <RefereeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/referee/reports"
          element={
            <ProtectedRoute roles={['REFEREE']}>
              <RefereeReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/standings"
          element={
            <ProtectedRoute>
              <StandingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <MatchesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches/:id"
          element={
            <ProtectedRoute>
              <MatchDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <TeamsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams/create"
          element={
            <ProtectedRoute roles={['CAPTAIN']}>
              <CreateTeamPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams/:id"
          element={
            <ProtectedRoute>
              <TeamDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/players/:id"
          element={
            <ProtectedRoute>
              <PlayerProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
