const logos = [
  { src: "/images/logo-1.svg", alt: "Client logo 1" },
  { src: "/images/logo-2.svg", alt: "Client logo 2" },
  { src: "/images/logo-3.svg", alt: "Client logo 3" },
  { src: "/images/logo-4.svg", alt: "Client logo 4" },
  { src: "/images/logo-5.svg", alt: "Client logo 5" },
  { src: "/images/logo-6.svg", alt: "Client logo 6" },
  { src: "/images/logo-7.svg", alt: "Client logo 7" },
];

// Duplicate for seamless infinite loop
const track = [...logos, ...logos];

export default function TickerSection({id}) {
  return (
    <section className="ticker-section" id={id}>
      <div className="ticker-inner">
        <div className="ticker-track">
          {track.map((logo, i) => (
            <div key={i} className="ticker-item">
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
