import renderRichText from "./utils/renderRichText";

export default function OwnStory({ data }) {
  if (!data) return null;

  return (
    <section className="own-story">
      <p className="own-story__tagline">{data?.Tagline}</p>
      <h2 className="own-story__title">{data?.title}</h2>
      <div className="own-story__desc">{renderRichText(data?.description)}</div>

      {data?.cta_link && (
        <a href={data.cta_link} className="own-story__cta">
          {data?.cta_text}
        </a>
      )}
    </section>
  );
}