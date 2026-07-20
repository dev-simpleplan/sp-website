// "use client";
// import Link from "next/link";
// import htsuVideoThumb from "../components/images/htsu-video-thumb.jpg";

// // Static for now — content will move to API-driven props later.
// // Kept in one object so swapping to `data` props is a quick refactor.
// const content = {
//   label: "Content",
//   heading: ["How This Shows Up", "In Work"],
//   description:
//     "Across categories and stages, the focus stays the same: clarity in direction and consistency in how the brand is built and expressed to create something unique.",
//   videoThumb: htsuVideoThumb,
//   videoAlt: "Brand build teaser",
//   videoCaption: "TEASER",
//   videoHref: "#!",
//   quote:
//     "See How The Work Actually Unfolds In Our Series Building A Brand, Where We Document The Process As It Happens.",
//   ctaText: "Watch the process",
//   ctaLink: "#!",
// };

// export default function HowThisShowsUp({ id }) {
//   return (
//     <section className="how-this-shows-up" id={id}>
//       <div className="container">
//         <div className="htsu-in gap-left">
//           {/* <p className="sec-label">{content.label}</p> */}

//           <h2 className="reveal-heading htsu-heading">
//             {content.heading.map((line, i) => (
//               <span key={i}>
//                 {line}
//                 {i < content.heading.length - 1 && <br />}
//               </span>
//             ))}
//           </h2>

//           <div className="htsu-content">
//             <a href={content.videoHref} className="htsu-video">
//               <img
//                 src={content.videoThumb.src}
//                 alt={content.videoAlt}
//                 className="img"
//               />
//               <span className="htsu-play-btn" aria-hidden="true">
//                 <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M13.5 8L0.75 15.3971L0.75 0.602886L13.5 8Z" fill="currentColor" />
//                 </svg>
//               </span>
//               <span className="htsu-video-caption">{content.videoCaption}</span>
//             </a>

//             <div className="htsu-text">
//               <p>{content.description}</p>
//             </div>
//           </div>

//           <div className="htsu-foot">
//             <p className="reveal-heading htsu-quote">{content.quote}</p>
//             <Link href={content.ctaLink} className="text-link">
//               {content.ctaText}
//             </Link>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
