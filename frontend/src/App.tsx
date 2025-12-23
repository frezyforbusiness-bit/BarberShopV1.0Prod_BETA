import { Routes, Route } from 'react-router-dom';
import { BookingPage } from './presentation/pages/public/BookingPage';
import { AdminLoginPage } from './presentation/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './presentation/pages/admin/AdminDashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BookingPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    </Routes>
  );
}

export default App;
