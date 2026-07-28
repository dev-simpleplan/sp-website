"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Wayfinding from "../components/Wayfinding";
import CompanyBanner from "../components/CompanyBanner";
import ApproachBranding from '../components/service/ApproachBranding';
import Ethos from '../components/company/Ethos';
import Founders from '../components/company/Founders';
import Awards from '../components/company/Awards';
import HowWeDoIt from '../components/company/HowWeDoIt';
import Initiatives from "../components/company/Initiatives";

// import LikeWhatYouSee from '../components/LikeWhatYouSee';
// import BringingClarity from '../components/BringingClarity';
// import OurApproach from '../components/OurApproach';
// import WeAreProud from '../components/WeAreProud';
// import HowThisShowUp from '../components/service/HowThisShowsUp';


export default function BrandingServicePage(){

  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/company?populate=*')
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

  useEffect(() => {
    if (loading) return;

    // Only safe to refresh GSAP's pinned-section measurements while the
    // user hasn't scrolled meaningfully yet — ScrollTrigger.refresh()
    // briefly un-pins/re-pins everything, which visibly flashes/jumps if
    // it fires while a pinned section is already active mid-scroll.
    const isSafeToRefresh = () => window.scrollY < 200;

    const notifyReady = () => {
      if (isSafeToRefresh()) {
        window.dispatchEvent(new Event("app:content-ready"));
      }
    };

    notifyReady();

    // Images loading after mount change section heights, which shifts
    // every pinned trigger below them — re-notify once any images that
    // were still loading at mount time finish, but only if still safe.
    const pendingImages = Array.from(document.images).filter((img) => !img.complete);

    if (pendingImages.length === 0) return;

    let remaining = pendingImages.length;
    const handleImageSettled = () => {
      remaining -= 1;
      if (remaining === 0) notifyReady();
    };

    pendingImages.forEach((img) => {
      img.addEventListener("load", handleImageSettled, { once: true });
      img.addEventListener("error", handleImageSettled, { once: true });
    });

    return () => {
      pendingImages.forEach((img) => {
        img.removeEventListener("load", handleImageSettled);
        img.removeEventListener("error", handleImageSettled);
      });
    };
  }, [loading]);

  const renderSection = (key, Component) => {
    if (!sections || !sections[key]) return null;
    return <Component data={sections[key]} />;
  };
  

  const HOME_SECTIONS = [
    
  ];

  return (
    <>
      <Wayfinding sections={HOME_SECTIONS} />
      <CompanyBanner />
      <ApproachBranding id="company_apprch" data={sections.company_about} />
      <Ethos id="ethos" data={sections.we_believe_in} />
      <Founders id="founders-sec" data={sections.founder_section}/>
      <Awards id="best_awards" data={sections.awards_and_stats} />
      <HowWeDoIt id="we_do_differently"/>
      <Initiatives id="initiative_section"/>

      {/* <LikeWhatYouSee id="like-what-you-see" />
      <BringingClarity id="bringing-clarity" data={sections.struggle} bullet-item={sections.bulletItem} />
      <OurApproach  id="our-approach"/>
      <WeAreProud id="we-are-proud" />
      <HowThisShowUp id="how-this-show-up" /> */}

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