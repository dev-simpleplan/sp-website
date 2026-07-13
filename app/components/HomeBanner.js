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
              <span>Book A Call</span>
              <span className="arrow-wrap">
                  <svg className="arrow arrow-1" width="12" height="12" viewBox="0 0 12 12" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                      <path
                            d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                            fill="currentColor" />
                  </svg>

                  <svg className="arrow arrow-2" width="12" height="12" viewBox="0 0 12 12" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                      <path
                            d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                            fill="currentColor" />
                  </svg>
              </span>
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
