import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import PortalDashboardPage from '../pages/portal/PortalDashboardPage';
import PortalTeamPage from '../pages/portal/PortalTeamPage';
import PortalTournamentsPage from '../pages/portal/PortalTournamentsPage';
import PortalProfilePage from '../pages/portal/PortalProfilePage';
import PortalMatchesPage from '../pages/portal/PortalMatchesPage';
import PortalStatsPage from '../pages/portal/PortalStatsPage';
import CaptainCreateTeamPage from '../pages/portal/CaptainCreateTeamPage';
import CaptainPaymentPage from '../pages/portal/CaptainPaymentPage';
import StaffDashboardPage from '../pages/portal/StaffDashboardPage';

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
        <Route path="/player/matches" element={<PortalMatchesPage mode="player" />} />
        <Route path="/player/stats" element={<PortalStatsPage mode="player" />} />
        <Route path="/player/profile" element={<PortalProfilePage mode="player" />} />
        <Route path="/captain/dashboard" element={<PortalDashboardPage mode="captain" />} />
        <Route path="/captain/create-team" element={<CaptainCreateTeamPage />} />
        <Route path="/captain/payment" element={<CaptainPaymentPage />} />
        <Route path="/captain/team" element={<PortalTeamPage mode="captain" />} />
        <Route path="/captain/tournaments" element={<PortalTournamentsPage mode="captain" />} />
        <Route path="/captain/matches" element={<PortalMatchesPage mode="captain" />} />
        <Route path="/captain/stats" element={<PortalStatsPage mode="captain" />} />
        <Route path="/captain/profile" element={<PortalProfilePage mode="captain" />} />
        <Route path="/organizer/dashboard" element={<StaffDashboardPage mode="organizer" />} />
        <Route path="/organizer/team" element={<StaffDashboardPage mode="organizer" />} />
        <Route path="/organizer/tournaments" element={<StaffDashboardPage mode="organizer" />} />
        <Route path="/organizer/matches" element={<StaffDashboardPage mode="organizer" />} />
        <Route path="/organizer/stats" element={<StaffDashboardPage mode="organizer" />} />
        <Route path="/admin/dashboard" element={<StaffDashboardPage mode="admin" />} />
        <Route path="/admin/users" element={<StaffDashboardPage mode="admin" />} />
        <Route path="/admin/tournaments" element={<StaffDashboardPage mode="admin" />} />
        <Route path="/admin/matches" element={<StaffDashboardPage mode="admin" />} />
        <Route path="/admin/stats" element={<StaffDashboardPage mode="admin" />} />
        <Route path="/admin/settings" element={<StaffDashboardPage mode="admin" />} />
        <Route path="/referee/dashboard" element={<StaffDashboardPage mode="referee" />} />
        <Route path="/referee/team" element={<StaffDashboardPage mode="referee" />} />
        <Route path="/referee/tournaments" element={<StaffDashboardPage mode="referee" />} />
        <Route path="/referee/matches" element={<StaffDashboardPage mode="referee" />} />
        <Route path="/referee/stats" element={<StaffDashboardPage mode="referee" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
