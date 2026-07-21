export default function BringingClarity({ id, data, bulletItems }) {
  const section = data?.struggle || data?.attributes || data || {};
  const items =
    bulletItems ||
    section.bullet_item ||
    section.bullet_items ||
    section.bulletItems ||
    section.bulletItem ||
    [];

  return (
    <section className="bringing-clarity" id={id}>
      <div className="container">
        <div className="bringing-clarity-in gap-left">
          <div className="heading">
            <div className="reveal-heading">
              <h2>{section.headline || "Bringing clarity to the foundation your brand scales on"}</h2>
            </div>
          </div>
          <div className="list-wrap">
            <ul>
              {items.map((item, index) => {
                const title = typeof item === "string" ? item : item?.title;
                return <li key={item?.id || title || index}>{title}</li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}