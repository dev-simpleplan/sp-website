"use client";

import { useEffect, useState } from "react";
import { styles } from "../ServiceInner/ServiceInner.css";

import Wayfinding from "../Wayfinding";
import RightSideLine from "../RightSideLine";
import ServiceBanner from "../ServiceInner/ServiceInnerBanner";
import VideoSection from "../ServiceInner/VideoSection";
import ApproachBranding from '../service/ApproachBranding';
import WhatWeDeliver from "../ServiceInner/WhatWeDeliver";
import OurProudWork from "../ServiceInner/OurProudWork";
import ReadyToBuild from "../ReadyToBuid";
import TestimonialSection from "../TestimonialSection";
import AiTools from "../ServiceInner/AiTools";
import ProductsSection from "../ServiceInner/ProductsSection";
import OtherServices from "../ServiceInner/OtherServices";

const SERVICE_SECTIONS = [
  { id: "service-banner", label: "Intro" },
  { id: "philosophy", label: "Philosophy" },
  { id: "what-we-deliver", label: "Deliverables" },
  { id: "our-proud-work", label: "Our Work" },
  { id: "get-in-touch", label: "Get In Touch" },
  { id: "testimonials", label: "Testimonials" },
  { id: "ai-tools", label: "AI Tools" },
  { id: "products", label: "Our Products" },
  { id: "other-services", label: "Other Services" },
];

export default function ServicePageTemplate({ slug }) {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSections() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/service/${encodeURIComponent(slug)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(payload?.error || "Failed to fetch service content.");
        }

        if (!payload?.data) {
          throw new Error("API response structure is incorrect.");
        }

        setSections(payload.data);
      } catch (fetchError) {
        if (fetchError.name === "AbortError") {
          return;
        }

        console.error(`Error fetching service content for "${slug}":`, fetchError);
        setError(fetchError);
      } finally {
        setLoading(false);
      }
    }

    fetchSections();

    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    if (loading) return;

    const isSafeToRefresh = () => window.scrollY < 200;

    const notifyReady = () => {
      if (isSafeToRefresh()) {
        window.dispatchEvent(new Event("app:content-ready"));
      }
    };

    notifyReady();

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

  console.log("Fetched sections:", sections.ai_tools);

  return (
    <>
      <Wayfinding sections={SERVICE_SECTIONS} />
      <RightSideLine />
      <ServiceBanner id="service-banner" data={sections.service_inner_banner} />
      <VideoSection data={sections.video_section} />
      <ApproachBranding id="philosophy" data={sections.philosphy} />
      <WhatWeDeliver id="what-we-deliver" data={sections.what_we_deliver} />
      <OurProudWork id="our-proud-work" data={sections.our_proud_work} />
      <ReadyToBuild id="get-in-touch" data={sections.simple_choice} />
      <TestimonialSection id="testimonials" data={sections.testimonials_section} />
      <AiTools id="ai-tools" data={sections.ai_tools} />
      <ProductsSection id="products" data={sections.products_section} />
      <OtherServices id="other-services" data={sections.other_services} />
    </>
  );
}