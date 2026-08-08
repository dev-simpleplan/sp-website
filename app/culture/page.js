"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Wayfinding from "../components/Wayfinding";
import CultureBanner from "../components/CultureBanner";
import VideoAnimated from "../components/VideoAnimated";
import OurApproach from "../components/OurApproach";
import HowWeDoIt from "../components/company/HowWeDoIt";
import OffsitesRetreats from "../components/culture/OffsitesRetreats";
import ReadyToBuild from "../components/ReadyToBuid";

import Initiatives from "../components/company/Initiatives";
import RightSideLine from "../components/RightSideLine";



export default function Culture(){

  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/culture?populate=*')
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
    // { id: "company-hero", label: sections.team_banner?.tagline },
    // { id: "meet_the_team", label: sections.meet_team?.tagline },
    // { id: "our_approach_team", label: sections.our_belief?.tagline },
    // { id: "benefits", label: sections.benefits?.tagline },
    // { id: "open_position", label: sections.open_position?.tagline },
    // { id: "initiative_section", label: sections.great_work_section?.tagline },
  ];

  return (
    <>
      <Wayfinding sections={HOME_SECTIONS} />
      <RightSideLine id="rightLine"/>
      <CultureBanner id="company-hero" data={sections.culture_banner} />
      <VideoAnimated data={sections.video_section} />
      <OurApproach id="principles" data={sections.principles} />
      <HowWeDoIt id="we_keep_standards" data={sections.we_keep_standards} />
      <OffsitesRetreats id="offsites_retreats" data={sections.offsites_retreats} />
      <ReadyToBuild id="join_team" data={sections.join_team}/>
      {/* <MeetTheTeam id="meet_the_team" data={sections.meet_team} />
      <OpenPosition id="open_position" data={sections.open_position}/>
      <Initiatives id="initiative_section" data={sections.great_work_section}/> */}

      {/* <ApproachBranding id="company_apprch" data={sections.company_about} />
      <Ethos id="ethos" data={sections.we_believe_in} />
      <Founders id="founders-sec" data={sections.founder_section}/>
      <Awards id="best_awards" data={sections.awards_and_stats} />
      <LikeWhatYouSee id="like-what-you-see-company" data={sections.awards_and_stats} stats={sections.awards_and_stats?.stats} />
      <WeAreProud id="we-are-proud" />
      <ReadyToBuild id="ReadyToBuild" data={sections.get_in_touch}/>
      <HowWeDoIt id="we_do_differently" data={sections.we_do_differently} />
      <Initiatives id="initiative_section" data={sections.initiative_section}/> */}

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