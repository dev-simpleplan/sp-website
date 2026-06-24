import ttbImg from "./images/ttb-img.png";

export default function ToolsToBuild() {
  return (
    <section className="tools-to-build">
      <div className="container">
        <div className="heading">
          <h2>Tools to build your brand</h2>
        </div>
        <div className="tools-to-build-in">
          <div className="ttb-fold">
            <div className="left">
              <div className="ttb-img">
                <img src={ttbImg.src} alt="Image" className="img" />
              </div>
            </div>
            <div className="right">
                <p>We've packaged everything we know into tools, templates, and SaaS products built for founders, freelancers, and agency owners. Whether you're building a brand from scratch or scaling an existing one, our products give you the thinking, the frameworks, and the tools to do it right.</p>
                <a href="#!" className="custom-btn">explore products</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
