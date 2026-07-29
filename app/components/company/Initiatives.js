import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "../getImageUrl";

export default function Initiatives({ id, data }) {
  const title = data?.title;
  const description = data?.description?.[0]?.children?.[0]?.text;
  const ctaText = data?.cta_text;
  const ctaLink = data?.cta_link;

  return (
    <section className="sp-for-good-sec" id={id}>
      <div className="container">
        <div className="spFor-good-in gap-left">
          <div className="heading">
            <h2>{title}</h2>
          </div>

          <div className="spFor-good-grid">
            <div className="for-good-img">
              {data?.image && (
                <img
                  src={getImageUrl(data.image)}
                  alt={title || "SimplePlan for Good"}
                  className="img"
                />
              )}
            </div>

            <div className="for-good-info">
              <p>{description}</p>

              <div className="for-good-cta">
                <Link
                  href={ctaLink || "#"}
                  className="custom-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{ctaText}</span>

                  <span className="arrow-wrap">
                    <svg
                      className="arrow arrow-1"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                        fill="currentColor"
                      />
                    </svg>

                    <svg
                      className="arrow arrow-2"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}