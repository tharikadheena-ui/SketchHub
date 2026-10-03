import { Navigate, Route, Routes } from 'react-router-dom';
import { PageContainer } from './components/layout/PageContainer';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AttendancePage } from './pages/AttendancePage';
import { AuditPage } from './pages/AuditPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { EventBuilderPage } from './pages/EventBuilderPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { EventsPage } from './pages/EventsPage';
import { ExportsPage } from './pages/ExportsPage';
import { OverviewPage } from './pages/OverviewPage';
import { ParticipantsPage } from './pages/ParticipantsPage';
import { PublicRegistrationPage } from './pages/PublicRegistrationPage';
import { RegistrationFormBuilderPage } from './pages/RegistrationFormBuilderPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <Routes>
      <Route element={<PageContainer />}>
        <Route index element={<OverviewPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/new" element={<EventBuilderPage />} />
        <Route path="events/registration-form" element={<RegistrationFormBuilderPage />} />
        <Route path="events/:eventId/registration-form" element={<RegistrationFormBuilderPage />} />
        <Route path="events/:eventId" element={<EventDetailsPage />} />
        <Route path="participants" element={<ParticipantsPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="exports" element={<ExportsPage />} />
        <Route path="audit" element={<AuditPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="/register/:eventId" element={<PublicRegistrationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
