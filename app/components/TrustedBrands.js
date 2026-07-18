import trustedImg from "./images/trustedBrand.svg";

export default function TrustedBrands({ id, data }) {
  return (
    <section className="trusted-brands" id={id}>
      <div className="container">
        <div className="trusted-brands-in gap-left">
          <p className="tb-heading">Trusted by 200+ brands across fashion, beauty, fitness & wellness</p>
          <div className="tb-logos">
            <img src={trustedImg.src} alt="Trusted brands" />
          </div>
        </div>
      </div>
    </section>
  );
}
