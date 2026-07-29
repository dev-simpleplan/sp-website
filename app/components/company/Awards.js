"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import AwardImage1 from "../images/clutch1.png"
import AwardImage2 from "../images/clutch1.png"
import AwardImage3 from "../images/clutch1.png"
import AwardImage4 from "../images/clutch1.png"
import AwardImage5 from "../images/clutch1.png"
import AwardImage6 from "../images/clutch1.png"
import { getImageUrl } from "../getImageUrl";

export default function AwardsTicker({ id, data }) {
    const tickerRef = useRef(null);

    useEffect(() => {
        const ticker = tickerRef.current;

        const tween = gsap.to(ticker, {
        xPercent: -50,
        ease: "none",
        duration: 25,
        repeat: -1,
        });

        // ticker.addEventListener("mouseenter", () => tween.pause());
        // ticker.addEventListener("mouseleave", () => tween.resume());

        return () => tween.kill();
    }, []);

    const awards =
    data?.best_awards?.map((award) => ({
        id: award.id,
        award_title: award.award_name,
        year: award.award_year,
        image: award.award_image,
    })) || [];

  return (
    <section className="awards-section">
        <div className="container">
            <div className="heading gap-left">
                <h2 className="reveal-heading">{data?.title}</h2>
            </div>
            <div className="ticker-wrapper">

                <div className="ticker-track" ref={tickerRef}>
                {[...awards, ...awards].map((award, index) => (
                    <div className="award-card" key={index}>
                        {award.image && (
                            <img
                                src={getImageUrl(award.image)}
                                alt={award?.title}
                                className="award-img"
                            />
                        )}

                        <div className="award-info">
                            <p className="award-title">{award?.award_title}</p>
                            <p className="award-year">{award?.year}</p>
                        </div>
                    </div>  
                ))}
                </div>

            </div>
        </div>
    </section>
  );
}