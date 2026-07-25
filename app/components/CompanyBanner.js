"use client";
import Link from "next/link";
import bannerImg from "./images/CompanyBannerImg.png";

export default function CompanyBanner() {
//   if (!data) return null;

  return (
    <section className="company-banner">
      {/* <div className="container"> */}
        <div className="company-banner-in">
            <img src={bannerImg.src} />
        </div>
      {/* </div> */}
    </section>
  );
}
