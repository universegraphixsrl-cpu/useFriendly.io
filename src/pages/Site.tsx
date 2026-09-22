import React from 'react';
import { SiteNav } from '../components/site/SiteNav';
import { SiteHero } from '../components/site/SiteHero';
import { SiteFeatures } from '../components/site/SiteFeatures';
import { SiteSpotlight } from '../components/site/SiteSpotlight';
import { SiteProcess } from '../components/site/SiteProcess';
import { SitePricing } from '../components/site/SitePricing';
import { SiteTestimonials } from '../components/site/SiteTestimonials';
import { SiteFaq } from '../components/site/SiteFaq';
import { SiteFooter } from '../components/site/SiteFooter';

interface SiteProps {
  onLogin: () => void;
  onSignup: () => void;
}

/** Site-ul public de prezentare Friendly */
export function Site({ onLogin, onSignup }: SiteProps) {
  return (
    <div className="min-h-full w-full bg-white font-sans text-ink">
      <SiteNav onLogin={onLogin} onSignup={onSignup} />
      <main>
        <SiteHero onEnterApp={onSignup} />
        <SiteFeatures />
        <SiteSpotlight />
        <SiteProcess />
        <SitePricing onEnterApp={onSignup} />
        <SiteTestimonials />
        <SiteFaq />
      </main>
      <SiteFooter onEnterApp={onSignup} />
    </div>);

}