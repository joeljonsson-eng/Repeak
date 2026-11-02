import React from 'react';
import CleanHero from '../components/CleanHero';
import FeaturedDeals from '../components/FeaturedDeals';
import HowItWorks from '../components/HowItWorks';
import SimplePriceEstimator from '../components/SimplePriceEstimator';
import WhyRepeak from '../components/WhyRepeak';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <>
      {/* Human-first, clear, modern search hero */}
      <CleanHero />

      {/* Real product bargains grid directly on the homepage */}
      <FeaturedDeals />

      {/* 3 Simple steps: "Så funkar Repeak" */}
      <HowItWorks />

      {/* Intuitive 3-click Wardrobe Valuation */}
      <SimplePriceEstimator />

      {/* Core trust & benefit props */}
      <WhyRepeak />

      {/* Price alert newsletter */}
      <Newsletter />
    </>
  );
}
