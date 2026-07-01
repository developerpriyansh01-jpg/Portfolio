import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import HireMePopup from '../components/shared/HireMePopup';
import ScrollToTop from '../components/shared/ScrollToTop';
import ScrollProgress from '../components/shared/ScrollProgress';
import CustomCursor from '../components/shared/CustomCursor';
import api from '../config/api';

export default function MainLayout() {
  const [hireMeOpen, setHireMeOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [totalVisitors, setTotalVisitors] = useState(0);

  useEffect(() => {
    api.get('/profile').then(({ data }) => setProfile(data.data)).catch(() => { });
    // Get visitor count from analytics
    api.get('/analytics/dashboard').then(({ data }) => {
      setTotalVisitors(data.data?.totalVisits || 0);
    }).catch(() => { });
  }, []);




  return (
    <div className="relative flex flex-col min-h-screen w-full max-w-full">
      <CustomCursor />
      <ScrollProgress />
      <Navbar onHireMeClick={() => setHireMeOpen(true)} resumeUrl={profile?.resume?.url} />
      <div className="flex-grow flex flex-col relative w-full">
        <Outlet context={{ onHireMeClick: () => setHireMeOpen(true) }} />
      </div>
      <Footer profile={profile} totalVisitors={totalVisitors} />
      <ScrollToTop />
      <HireMePopup isOpen={hireMeOpen} onClose={() => setHireMeOpen(false)} />
    </div>
  );
}
