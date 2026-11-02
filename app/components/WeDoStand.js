"use client";
import { useState } from "react";
import { getImageUrl } from "./getImageUrl";
// import useStickyStepStack from "../hooks/useStickyStepStack";

const ARROW_LEFT = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ARROW_RIGHT = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// Same look as before (image left, content right, one award at a time), but
// stepped with Prev / Next buttons instead of page scroll.
export default function WeDoStand({ id, data }) {
  const items = data?.projects || [];
  const [index, setIndex] = useState(0);

  if (!data) return null;

  const lastIndex = Math.max(items.length - 1, 0);
  // Clamped at render so a data change can never leave the index past the end.
  const current = Math.min(index, lastIndex);
  const item = items[current];
  const move = (direction) =>
    setIndex(Math.max(0, Math.min(current + direction, lastIndex)));

  const controls = items.length > 1 && (
    <div className="wds-slider__controls">
      <button
        type="button"
        onClick={() => move(-1)}
        aria-label="Previous"
        disabled={current === 0}
      >
        {ARROW_LEFT}
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        aria-label="Next"
        disabled={current === lastIndex}
      >
        {ARROW_RIGHT}
      </button>
    </div>
  );

  return (
    <section className="we-do-stand" id={id}>
      <div className="we-do-stand-sticky wds-fit">
        <div className="container">
          <div className="wds-top-heading gap-left">
            <h2 className="reveal-heading">{data?.title}</h2>
          </div>

          {/* Desktop: image left, content right. `key={current}` remounts the
              slide on every step so it fades in. */}
          <div className="we-do-stand-in gap-left">
            <div className="wds-left">
              <div className="wds-img-stack">
                {item && (
                  <div key={current} className="wds-img-slide wds-slide-in">
                    <img
                      src={getImageUrl(item?.image, "small")}
                      srcSet={`
                        ${getImageUrl(item?.image, "thumbnail")} 125w,
                        ${getImageUrl(item?.image, "small")} 399w,
                        ${getImageUrl(item?.image)} 449w
                      `}
                      sizes="(max-width: 767px) 100vw, 449px"
                      alt={item?.image?.alternativeText || item?.title}
                      className="img"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="wds-right">
              <div className="wds-items-wrap wds-items-wrap--static">
                {item && (
                  <div key={current} className="wds-item wds-item--static wds-slide-in">
                    <div className="wds-item-top">
                      <h3>{item?.title}</h3>
                      <span className="wds-year">{item?.year}</span>
                    </div>
                    <p className="wds-desc">{item?.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop: arrows sit below the image + content row. */}
          <div className="wds-controls-desktop gap-left">{controls}</div>

          {/* Mobile: image + text kept together as one card — hidden on desktop. */}
          <div className="wds-mobile-list">
            {item && (
              <div key={current} className="wds-mobile-card wds-slide-in">
                <div className="wds-mobile-img">
                  <img
                    src={getImageUrl(item?.image, "small")}
                    alt={item?.image?.alternativeText || item?.title}
                    className="img"
                  />
                </div>
                <div className="wds-item-top">
                  <h3>{item?.title}</h3>
                  <span className="wds-year">{item?.year}</span>
                </div>
                <p className="wds-desc">{item?.description}</p>
              </div>
            )}
            {controls}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Previous version (scroll-driven sticky step stack) ────────────────────
// Kept commented out so it can be restored. It needs the useStickyStepStack
// import above (and `useRef` instead of `useState`), plus `data-sticky-section`
// on the <section>.
//
// export default function WeDoStand({ id, data }) {
//   const sectionRef = useRef(null);
//   const imgRefs = useRef([]);
//   const itemRefs = useRef([]);
//   const wrapRef = useRef(null);
//   const stageRef = useRef(null); // .wds-left — items reveal/clip against ITS height, not their own
//   const items = data?.projects || [];
//
//   useStickyStepStack(sectionRef, itemRefs, imgRefs, wrapRef, items.length, stageRef);
//
//   return (
//     <section ref={sectionRef} className="we-do-stand" id={id} data-sticky-section>
//       <div className="we-do-stand-sticky">
//         {/* <div className="wds-viewport gap-left"> */}
//           <div className="container">
//             <div className="wds-top-heading gap-left">
//               <h2 className="reveal-heading">{data?.title}</h2>
//             </div>
//
//             {/* Desktop: image column crossfades independently of the text
//                 column sliding up — hidden on mobile (see .wds-mobile-list
//                 below), since splitting into two columns there would stack
//                 all images first, then all text, instead of pairing them. */}
//             <div className="we-do-stand-in gap-left">
//               {/* LEFT — image stack, stays in place while section is pinned */}
//               <div className="wds-left" ref={stageRef}>
//                 <div className="wds-img-stack">
//                   {items.map((item, i) => (
//                     <div
//                       key={i}
//                       className="wds-img-slide"
//                       ref={el => (imgRefs.current[i] = el)}
//                     >
//                       <img
//                         src={getImageUrl(item?.image, "small")}
//                         srcSet={`
//                           ${getImageUrl(item?.image, "thumbnail")} 125w,
//                           ${getImageUrl(item?.image, "small")} 399w,
//                           ${getImageUrl(item?.image)} 449w
//                         `}
//                         sizes="(max-width: 767px) 100vw, 449px"
//                         alt={item?.image?.alternativeText || item?.title}
//                         className="img"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//
//               {/* RIGHT — items slide up one by one inside overflow:hidden wrap */}
//               <div className="wds-right">
//                 <div className="wds-items-wrap" ref={wrapRef}>
//                   {items.map((item, i) => (
//                     <div
//                       key={i}
//                       className="wds-item"
//                       ref={el => (itemRefs.current[i] = el)}
//                     >
//                       <div className="wds-item-top">
//                         <h3>{item?.title}</h3>
//                         <span className="wds-year">{item?.year}</span>
//                       </div>
//                       <p className="wds-desc">{item?.description}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//
//             {/* Mobile: each award's image + text kept together as one card,
//                 plain vertical stack — hidden on desktop. */}
//             <div className="wds-mobile-list">
//               {items.map((item, i) => (
//                 <div key={i} className="wds-mobile-card">
//                   <div className="wds-mobile-img">
//                     <img
//                       src={getImageUrl(item?.image, "small")}
//                       alt={item?.image?.alternativeText || item?.title}
//                       className="img"
//                     />
//                   </div>
//                   <div className="wds-item-top">
//                     <h3>{item?.title}</h3>
//                     <span className="wds-year">{item?.year}</span>
//                   </div>
//                   <p className="wds-desc">{item?.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         {/* </div> */}
//       </div>
//     </section>
//   );
// }
