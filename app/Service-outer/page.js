"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Wayfinding from "../components/Wayfinding";
import ServiceBanner from "../components/ServiceBanner";
import LikeWhatYouSee from '../components/LikeWhatYouSee';
import BringingClarity from '../components/BringingClarity';
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
  

  const HOME_SECTIONS = [
    
  ];

  return (
    <>
      <Wayfinding sections={HOME_SECTIONS} />
      <ServiceBanner data={sections.branding_outer_banner} />
      <LikeWhatYouSee id="like-what-you-see" />
      <BringingClarity id="bringing-clarity" data={sections.struggle} bullet-item={sections.bulletItem} />
      <OurApproach  id="our-approach"/>
      <WeAreProud id="we-are-proud" />
      <HowThisShowUp id="how-this-show-up" />

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