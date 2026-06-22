"use client";
import Image from "next/image";
import Script from 'next/script';
import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import Head from 'next/head';
// import Banner from "./components/homepage/Banner";
// import BxSlider from "./components/homepage/BxSlider";
// import Spacer from "./components/spacer";
// import Service from "./components/homepage/Service";
// import MyIcon from "./components/common/MyIcon";


export default function Home() {

  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    axios.get('/api/home-page?populate=*')
    .then(response => {
      // console.log("Full API Response:", response);
      // console.log("Extracted Data:", response.data.data);

      if (response.data && response.data.data) {
        setSections(response.data.data); // ✅ Correctly set sections to `data.data`
      } else {
        console.error("API response structure is incorrect", response.data);
        setSections({}); // Prevent errors by setting an empty object
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
    if (!sections || !sections[key]) {
      console.warn(`Skipping ${key} - No data available`);
      return null;
    }
  
    //console.log(`Rendering ${key}:`, sections[key]); // Debugging
    return (
      <>
        <Component data={sections[key]} />
        <Spacer />
      </>
    );
  };

  if (loading) return <div className="loading">
    <div className="loadingIn">
      <div className="loadingImage">
      {/* <MyIcon/> */}
      </div>
      <div className="loadingText">Loading...</div>
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
  </div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
    
  </>
  );
}