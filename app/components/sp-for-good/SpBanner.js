"use client";
import { getImageUrl } from "../getImageUrl";

// Id of the partnership form section further down the same page.
const FORM_SECTION_ID = "partnership";

export default function SpBanner({ id, data }) {
  if (!data) return null;

  // Smooth-scroll to the form on the same page. A <button> (not a link) so
  // the browser doesn't show a URL in the status bar on hover.
  const handleCtaClick = () => {
    document
      .getElementById(FORM_SECTION_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="home-banner sp-for-good" id={id}>
      <div className="container">
        <div className="home-banner-in">
          <h1 className="reveal-heading">{data?.title}</h1>
          <p>
            {data.description?.[0]?.children?.[0]?.text}
          </p>
          <div className="home-b-cta">
            <button
              type="button"
              onClick={handleCtaClick}
              className="custom-btn"
              style={{ cursor: "pointer", fontFamily: "inherit" }}
            >
              <span>{data?.cta_text}</span>
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
            </button>
          </div>
        </div>
        <div className="custom-banner-media">
                <div className="custom-banner-img">
                    {data?.image && (
                        <img
                            src={getImageUrl(data.image)}
                            alt={data?.title}
                            className="img"
                        />
                    )}
                </div>
            </div>
      </div>
    </section>
  );
}
