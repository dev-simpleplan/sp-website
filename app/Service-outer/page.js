"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Wayfinding from "../components/Wayfinding";
import ServiceBanner from "../components/ServiceBanner";
import LikeWhatYouSee from '../components/LikeWhatYouSee';
import ApproachBranding from '../components/service/ApproachBranding';
import OurApproach from '../components/OurApproach';
import WeAreProud from '../components/WeAreProud';
import HowThisShowUp from '../components/service/HowThisShowsUp';

export default function BrandingServicePage(){

const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/branding-service-outer?populate=*')
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

  console.log("Branding Service Page Sections:", sections.scope_work);
  

  const HOME_SECTIONS = [
    { id: "service-banner", label: "Intro" },
    { id: "approach-branding", label: "Approach" },
    { id: "our-approach", label: "Services" },
    { id: "we-are-proud", label: "Transformation" },
    { id: "how-this-show-up", label: "Content" },
  ];

  return (
    <>
      <Wayfinding sections={HOME_SECTIONS} />
      <ServiceBanner data={sections?.branding_outer_banner} id="service-banner"/>
      <LikeWhatYouSee id="like-what-you-see" data={sections?.stats} stats={sections?.stats}/>
      <ApproachBranding data={sections?.branding_approach} id="approach-branding"/>
      <OurApproach  id="our-approach" data={sections?.scope_work}/>
      <WeAreProud id="we-are-proud" data={sections?.transformation}/>
      <HowThisShowUp id="how-this-show-up" data={sections?.work_shows_up}/>

      {/* API-dependent sections — show loader until data arrives */}
      {loading && (
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
      )}

      {/* {error && <div>Error: {error.message}</div>} */}

      {!loading && !error && (
        <>
          {/* Add API sections here via renderSection() */}
        </>
        )}
    </>
  );
}