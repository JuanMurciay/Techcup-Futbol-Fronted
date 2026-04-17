import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import PortalDashboardPage from '../pages/portal/PortalDashboardPage';
import PortalTeamPage from '../pages/portal/PortalTeamPage';
import PortalTournamentsPage from '../pages/portal/PortalTournamentsPage';
import PortalProfilePage from '../pages/portal/PortalProfilePage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/player/dashboard" element={<PortalDashboardPage mode="player" />} />
        <Route path="/player/team" element={<PortalTeamPage mode="player" />} />
        <Route path="/player/tournaments" element={<PortalTournamentsPage mode="player" />} />
        <Route path="/player/profile" element={<PortalProfilePage mode="player" />} />
        <Route path="/captain/dashboard" element={<PortalDashboardPage mode="captain" />} />
        <Route path="/captain/team" element={<PortalTeamPage mode="captain" />} />
        <Route path="/captain/tournaments" element={<PortalTournamentsPage mode="captain" />} />
        <Route path="/captain/profile" element={<PortalProfilePage mode="captain" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
