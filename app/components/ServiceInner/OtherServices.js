"use client";
import { getImageUrl } from "../getImageUrl";

const extractText = (description = []) =>
  description.map((block) => (block.children || []).map((c) => c.text).join("")).join("\n");

export default function OtherServices({ id, data }) {
  const services = data?.related_services || [];

  if (!data) return null;

  return (
    <section className="other-services" id={id}>
      <div className="container">
        <div className="other-services-top gap-left">
          <h2 className="reveal-heading">{data?.title}</h2>
        </div>

        <div className="other-services-grid gap-left">
          {services.map((service) => (
            <div className="other-service-card" key={service.id}>
              <div className="other-service-img">
                <img
                  src={getImageUrl(service.image?.[0])}
                  alt={service.image?.[0]?.alternativeText || service.title}
                  className="img"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>

              <div className="other-service-info">
                <h3 className="other-service-title">{service.title}</h3>
                <p className="other-service-desc">{extractText(service.description)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}