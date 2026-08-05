"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getImageUrl } from "./getImageUrl";

export default function CompanyBanner({ id, data, loading }) {
  const title = data?.title;
  const subtitle = data?.subtitle;
  const topPanel = useRef(null);
  const bottomPanel = useRef(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    if (loading || !imageLoaded) return;

    const timer = setTimeout(() => {
      const tl = gsap.timeline();

      tl.to(topPanel.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
      });

      tl.to(
        bottomPanel.current,
        {
          yPercent: 100,
          duration: 1.2,
          ease: "power4.inOut",
        },
        "<"
      );
    }, 50);

    return () => clearTimeout(timer);
  }, [loading, imageLoaded]);

  return (
    <section className="company-banner" id={id}>
      <div className="banner-reveal">
        <div ref={topPanel} className="reveal-panel reveal-top" />
        <div ref={bottomPanel} className="reveal-panel reveal-bottom" />
      </div>
      <div className="company-banner-in">
        {data?.banner_image && (
          <img
            src={getImageUrl(data.banner_image)}
            alt={title || "Company Banner"}
            onLoad={() => setImageLoaded(true)}
          />
        )}

        {/* Uncomment if your design includes these */}
        {/* <div className="company-banner-content">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div> */}
      </div>
    </section>
  );
}


// "use client";

// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { getImageUrl } from "./getImageUrl";

// export default function CompanyBanner({ id, data }) {
//   const imgWrapRef = useRef(null);

//   const title = data?.title;
//   const subtitle = data?.subtitle;
//   const imageSrc = data?.banner_image ? getImageUrl(data.banner_image) : null;

//   useEffect(() => {
//     if (!imgWrapRef.current) return;

//     const ctx = gsap.context(() => {
//       // Starts as a thin centered strip (top/bottom clipped away),
//       // then expands to fill the full banner on load.
//       gsap.fromTo(
//         imgWrapRef.current,
//         { clipPath: "inset(36% 0% 36% 0%)" },
//         {
//           clipPath: "inset(0% 0% 0% 0%)",
//           duration: 1.6,
//           ease: "power3.inOut",
//           delay: 0.3,
//         }
//       );
//     }, imgWrapRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section className="company-banner" id={id}>
//       <div className="company-banner-in">
//         {imageSrc && (
//           <div ref={imgWrapRef} className="company-banner-img-wrap">
//             <img
//               src={imageSrc}
//               alt={title || "Company Banner"}
//               className="company-banner-img"
//             />
//           </div>
//         )}

//         {/* Uncomment if your design includes these */}
//         {/* <div className="company-banner-content">
//           <h1>{title}</h1>
//           <p>{subtitle}</p>
//         </div> */}
//       </div>
//     </section>
//   );
// }