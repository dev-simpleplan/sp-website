"use client";

import Link from "next/link";
import { getImageUrl } from "../getImageUrl";

export default function HowThisShowsUp({ id, data }) {
  if (!data) return null;

  const heading = data?.title?.split(" in ") || [data?.title];

  return (
    <section className="how-this-shows-up" id={id}>
      <div className="container">
        <div className="htsu-in gap-left">
          {/* <p className="sec-label">{data?.tagline}</p> */}

          <h2 className="reveal-heading htsu-heading">
            {heading.map((line, i) => (
              <span key={i}>
                {line}
                {i < heading.length - 1 && <br />}
              </span>
            ))}
          </h2>

          <div className="htsu-content">
            <a
              href={data?.cta_link || "#!"}
              className="htsu-video"
            >
              <img
                src={getImageUrl(data?.image)}
                alt={
                  data?.image?.alternativeText ||
                  data?.image?.name ||
                  data?.title
                }
                className="img"
              />

              <span className="htsu-play-btn" aria-hidden="true">
                <svg
                  width="14"
                  height="16"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5 8L0.75 15.3971L0.75 0.602886L13.5 8Z"
                    fill="currentColor"
                  />
                </svg>
              </span>

              <span className="htsu-video-caption">
                {data?.tagline}
              </span>
            </a>

            <div className="htsu-text">
              <p className="split-reveal">
                {data?.description?.[0]?.children?.[0]?.text}
              </p>
            </div>
          </div>

          <div className="htsu-foot">
            <h6 className="reveal-heading htsu-quote">
              {data?.below_title}
            </h6>

            <Link
              href={data?.cta_link || "#!"}
              className="custom-cta-link"
            >
              <span className="text-wrap">
                <span className="text text-1">
                  {data?.cta_text}
                </span>
                <span className="text text-2">
                  {data?.cta_text}
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}