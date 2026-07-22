"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import HomeBanner from "./components/HomeBanner";
import VideoAnimated from "./components/VideoAnimated";
import TickerSection from "./components/TickerSection";
import BringingClarity from './components/BringingClarity';
import OurApproach from './components/OurApproach';
import LikeWhatYouSee from './components/LikeWhatYouSee';
import ReadyToBuild from './components/ReadyToBuid';
import MeetTheSimp from './components/MeetTheSimp';
import WeAreProud from './components/WeAreProud';
import WeDoStand from './components/WeDoStand';
import ToolsToBuild from './components/ToolsToBuild';
import YourBrandsLook from './components/YourBrandsLook';
import ThinkBeforeBuild from './components/ThinkBeforeBuild';
import TestimonialSection from './components/TestimonialSection';
import Wayfinding from "./components/Wayfinding";
import TrustedBrands from './components/TrustedBrands';


export default function Home() {

  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/home-page?populate=*')
      .then(response => {
        if (response.data && response.data.data) {
          setSections(response.data.data);
        } else {
          console.error("API response structure is incorrect", response.data);
          setSections({});
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);
 
  const renderSection = (key, Component) => {
    if (!sections || !sections[key]) return null;
    return <Component data={sections[key]} />;
  };

  const HOME_SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "bringing-clarity", label: "The Struggle" },
  { id: "our-approach", label: "Our Approach" },
  { id: "we-are-proud", label: "Our Work" },
  { id: "your-brands-look", label: "Services" },
  { id: "ready-to-build", label: "Get In Touch" },
  { id: "testimonial-section", label: "Testimonials" },
  { id: "we-do-stand", label: "Awards" },
  { id: "meet-the-simp", label: "About" },
  { id: "tools-to-build", label: "Tools" },
  { id: "think-before-build", label: "Blogs" },

];

  if (loading) {
    return (
      <div className="loading">
        <div className="loadingIn">
          <div className="loadingText">
            <span data-text="L">L</span>
            <span data-text="O">O</span>
            <span data-text="A">A</span>
            <span data-text="D">D</span>
            <span data-text="I">I</span>
            <span data-text="N">N</span>
            <span data-text="G">G</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log(sections.testimonials);

  return (
    <>
      <Wayfinding sections={HOME_SECTIONS} />
      <HomeBanner id="hero" data={sections.hero} />
      <TickerSection/>
      <VideoAnimated data={sections.video_section} />
      <BringingClarity id="bringing-clarity" data={sections?.struggle}/>
      <OurApproach  id="our-approach" data={sections.our_approach}/>
      <WeAreProud id="we-are-proud" data={sections.case_study}/>
      <LikeWhatYouSee id="like-what-you-see" data={sections.offer_section} stats={sections.stats}/>
      <YourBrandsLook id="your-brands-look" data={sections.service}/>
      <ReadyToBuild id="ready-to-build" data={sections.ready_to_build}/>
      <TestimonialSection id="testimonial-section" data={sections.testimonials} />
      <TrustedBrands id="trustedBy-section" data={sections.trusted_section}/>
      <WeDoStand id="we-do-stand" />
      <MeetTheSimp id="meet-the-simp" />
      <ToolsToBuild id="tools-to-build" />
      <ThinkBeforeBuild id="think-before-build" />
    </>
  );
}
