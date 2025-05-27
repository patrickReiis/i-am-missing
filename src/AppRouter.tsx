import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CreateReportPage from "./pages/CreateReportPage";
import ReportDetailPage from "./pages/ReportDetailPage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateReportPage />} />
        <Route path="/report/:id" element={<ReportDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile/:pubkey" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;