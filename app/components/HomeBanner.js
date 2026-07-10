"use client";
import Link from "next/link";

export default function HomeBanner({id}) {
  return (
    <section className="home-banner" id={id}>
      <div className="container">
        <div className="home-banner-in">
          <h1>Your brand built to be unmissable</h1>
          <p>
            We work with founders to build brands that cut through noise,
            command attention, and scale - by designing the clarity your
            business runs on.
          </p>
          <div className="home-b-cta">
            <Link href="/contact" className="custom-btn">
              Book A Call
            </Link>
            <Link href="/work" className="custom-cta-link">
              See Our Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
