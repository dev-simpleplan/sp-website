import React from 'react'
import Wayfinding from '../components/Wayfinding';
import ServiceBanner from '../components/ServiceBanner';

export const metadata = {
  title: "Service Outer — sp-website",
};

export default function ServiceOuter() {

      const HOME_SECTIONS = [
  
];

  return (
    <>
    <Wayfinding sections={HOME_SECTIONS} />
    <ServiceBanner
  tagLabel="Intro"
  heading={["Branding Is Not", "What People See"]}
  subtext="It is what they experience over time"
  ctaText="Start a Branding Project"
  ctaHref="/contact"
  overlayText="What a Brand Is?"
  videoId="YOUR_YOUTUBE_VIDEO_ID"
/>
    </>
  )
}
