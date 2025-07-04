import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Topbar from "@/components/Topbar";
import SearchPage from "@/pages/SearchPage";
import MapSelectPage from "@/pages/MapSelectPage";
import ResultsPage from "@/pages/ResultsPage";
import PropertyForm from "@/pages/PropertyForm";
import NotFound from "@/pages/NotFound";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

function AppLayout() {
  const location = useLocation();
  const hideFooter = location.pathname === "/map-select";
  return (
    <>
      <Topbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/map-select" element={<MapSelectPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/property-form" element={<PropertyForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideFooter && <Footer />}
      <ScrollToTopButton />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
