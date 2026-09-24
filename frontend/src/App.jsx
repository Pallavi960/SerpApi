import React from 'react';
import { TripProvider, useTrip } from './context/TripContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import TripBuilderPage from './pages/TripBuilderPage';
import ResearchCenterPage from './pages/ResearchCenterPage';
import DashboardPage from './pages/DashboardPage';

function AppContent() {
  const { activeScreen } = useTrip();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        {activeScreen === 'landing' && <LandingPage />}
        {activeScreen === 'builder' && <TripBuilderPage />}
        {activeScreen === 'research' && <ResearchCenterPage />}
        {activeScreen === 'dashboard' && <DashboardPage />}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <TripProvider>
      <AppContent />
    </TripProvider>
  );
}
