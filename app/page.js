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

  return (
    <>
      {/* Static sections — always render, no API needed */}
      <HomeBanner />
      <TickerSection />
      <VideoAnimated />
      <BringingClarity />
      <OurApproach />
      <LikeWhatYouSee />
      <ReadyToBuild />
      <MeetTheSimp />

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

      {error && <div>Error: {error.message}</div>}

      {!loading && !error && (
        <>
          {/* Add API sections here via renderSection() */}
        </>
      )}
    </>
  );
}
