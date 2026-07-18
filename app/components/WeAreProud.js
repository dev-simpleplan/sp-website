// "use client";
// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import weAreP from "./images/we-are-p.png";
// import weAreP2 from "./images/we-are-p2.png";
// import weAreP3 from "./images/we-are-p3.png";
// import weAreP4 from "./images/we-are-p4.png";

// export default function WeAreProud({id}) {
//   const sectionRef = useRef(null);
//   const trackRef   = useRef(null);

//   useEffect(() => {
//     gsap.registerPlugin(ScrollTrigger);

//     const ctx = gsap.context(() => {
//       const track = trackRef.current;

//       gsap.to(track, {
//         x: () => -(track.scrollWidth - window.innerWidth),
//         ease: "none",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           pin: true,
//           scrub: 1.2,
//           end: () => `+=${track.scrollWidth - window.innerWidth}`,
//           invalidateOnRefresh: true,
//         },
//       });
//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   const cards = [
//     {
//       image: weAreP,
//       title: "Invouge",
//       subtitle: "Rewriting rules of beauty and shapewear",
//       year: "2026",
//       metric: "3.2",
//       metricSuffix: "x",
//       metricLabel: "Revenue Growth",
//       services: ["Brand Positioning", "Brand Messaging", "Content"],
//       href: "#!",
//     },
//     {
//       image: weAreP2,
//       title: "aukera",
//       subtitle: "Rewriting rules of beauty and shapewear",
//       year: "2025",
//       metric: "10.5",
//       metricSuffix: "Cr",
//       metricLabel: "Funding Raised",
//             services: ["Brand Positioning", "Brand Messaging", "Content"],
//       href: "#!",
//     },
//     {
//       image: weAreP3,
//       title: "crawford",
//       subtitle: "Rewriting rules of beauty and shapewear",
//       year: "2025",
//       metric: "1.2",
//       metricSuffix: "x",
//       metricLabel: "Revenue Growth",
//       services: ["Brand Positioning", "Brand Messaging", "Content"],
//       href: "#!",
//     },
//     {
//       image: weAreP4,
//       title: "Gutly",
//       subtitle: "Rewriting rules of beauty and shapewear",
//       year: "2025",
//       metric: "2.6",
//       metricSuffix: "x",
//       metricLabel: "Funding Raised",
//       services: ["Brand Positioning", "Brand Messaging", "Content"],
//       href: "#!",
//     },
//   ];

//   return (
//     <section ref={sectionRef} className="we-are-proud" id={id}>
//       <div className="container">
//         <div className="we-are-proud-head gap-left">
//           <div className="heading">
//             <h2>Work we are proud of</h2>
//           </div>
//         </div>
//       </div>

//       <div ref={trackRef} className="we-are-proud-in gap-left">
//         {cards.map((card, i) => (
//           <a href={card.href} key={i}>
//             <div className="fold-wrap">
//               <div className="left">
//                 <div className="wap-img">
//                   <img src={card.image.src} alt={card.title} className="img" />
//                 </div>
//                 <div className="wap-text">
//                   <div className="wap-text-left">
//                     <h5>{card.title}</h5>
//                     <p>{card.subtitle}</p>
//                   </div>
//                   <div className="ap-text-right">
//                     <p>{card.year}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="right">
//                 <div className="fw-right-top">
//                   <h4>{card.metric}<span>{card.metricSuffix}</span></h4>
//                   <p>{card.metricLabel}</p>
//                 </div>
//                 <div className="fw-right-bottom">
//                   <p className="eye-head">What we did</p>
//                   <div className="fw-points-wrap">
//                     {card.services.map((s, j) => (
//                       <p key={j}>{s}</p>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </a>
//         ))}
//       </div>
//     </section>
//   );
// }


"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import weAreP from "./images/we-are-p.png";
import weAreP2 from "./images/we-are-p2.png";
import weAreP3 from "./images/we-are-p3.png";
import weAreP4 from "./images/we-are-p4.png";

export default function WeAreProud({id}) {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop, isMobile } = context.conditions;
        const track = trackRef.current;
        // each direct child of the track is one <a className="fold-wrap"...> card
        const cardEls = gsap.utils.toArray(track.children);

        if (isDesktop) {
          gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              pin: true,
              scrub: 1.2,
              end: () => `+=${track.scrollWidth - window.innerWidth}`,
              invalidateOnRefresh: true,
            },
          });
        }

        if (isMobile) {
          // start with only the first card visible, rest hidden (stacked via CSS)
          gsap.set(cardEls, { autoAlpha: 0 });
          gsap.set(cardEls[0], { autoAlpha: 1 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => `+=${(cardEls.length - 1) * window.innerHeight}`,
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });

          cardEls.forEach((card, i) => {
            if (i === 0) return;
            // crossfade: previous card fades out while next fades in, at each step
            tl.to(cardEls[i - 1], { autoAlpha: 0, duration: 1 }, i - 1)
              .to(card, { autoAlpha: 1, duration: 1 }, i - 1);
          });
        }
      }
    );

    return () => mm.revert();
  }, []);

  const cards = [
    {
      image: weAreP,
      title: "Invouge",
      subtitle: "Rewriting rules of beauty and shapewear",
      year: "2026",
      metric: "3.2",
      metricSuffix: "x",
      metricLabel: "Revenue Growth",
      services: ["Brand Positioning", "Brand Messaging", "Content"],
      href: "#!",
    },
    {
      image: weAreP2,
      title: "aukera",
      subtitle: "Rewriting rules of beauty and shapewear",
      year: "2025",
      metric: "10.5",
      metricSuffix: "Cr",
      metricLabel: "Funding Raised",
            services: ["Brand Positioning", "Brand Messaging", "Content"],
      href: "#!",
    },
    {
      image: weAreP3,
      title: "crawford",
      subtitle: "Rewriting rules of beauty and shapewear",
      year: "2025",
      metric: "1.2",
      metricSuffix: "x",
      metricLabel: "Revenue Growth",
      services: ["Brand Positioning", "Brand Messaging", "Content"],
      href: "#!",
    },
    {
      image: weAreP4,
      title: "Gutly",
      subtitle: "Rewriting rules of beauty and shapewear",
      year: "2025",
      metric: "2.6",
      metricSuffix: "x",
      metricLabel: "Funding Raised",
      services: ["Brand Positioning", "Brand Messaging", "Content"],
      href: "#!",
    },
  ];

  return (
    <section ref={sectionRef} className="we-are-proud" id={id}>
      <div className="container">
        <div className="we-are-proud-head gap-left">
          <div className="heading">
            <h2>Work we are proud of</h2>
          </div>
        </div>
      </div>

      <div ref={trackRef} className="we-are-proud-in gap-left">
        {cards.map((card, i) => (
          <a href={card.href} key={i}>
            <div className="fold-wrap">
              <div className="left">
                <div className="wap-img">
                  <img src={card.image.src} alt={card.title} className="img" />
                </div>
                <div className="wap-text">
                  <div className="wap-text-left">
                    <h5>{card.title}</h5>
                    <p>{card.subtitle}</p>
                  </div>
                  <div className="ap-text-right">
                    <p>{card.year}</p>
                  </div>
                </div>
              </div>
              <div className="right">
                <div className="fw-right-top">
                  <h4>{card.metric}<span>{card.metricSuffix}</span></h4>
                  <p>{card.metricLabel}</p>
                </div>
                <div className="fw-right-bottom">
                  <p className="eye-head">What we did</p>
                  <div className="fw-points-wrap">
                    {card.services.map((s, j) => (
                      <p key={j}>{s}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}