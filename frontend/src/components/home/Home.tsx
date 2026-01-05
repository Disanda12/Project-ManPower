import React from 'react';
import EnterpriseHero from './components/EnterpriseHero';
import PersonaSplit from './components/PersonaSplit';
import IndustryGrid from './components/IndustryGrid';
import StatsSection from './components/StatsSection';


const HomePage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Section with Search */}
      <div className='mt-6'>
      <EnterpriseHero />
      </div>

      {/* 2. Customer Action Card (Find a Worker) */}
      <div className="py-12">
        <PersonaSplit />
      </div>

      {/* 3. Service Categories Grid */}
      <IndustryGrid />

      {/* 4. Trust & Impact Statistics */}
      <StatsSection />

    
    </main>
  );
};

export default HomePage;