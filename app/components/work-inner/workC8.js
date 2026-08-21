export default function C8TextCol({ data }) {
  if (!data) return null;

  const { title, description } = data;

  return (
    <section className="work-c8">
      <div className="work-c8__container not-full-width">
        <div className="work-c8__title work-component-title">
          <h2>{title}</h2>
        </div>

        <div className="work-c8__description">
          {description?.map((block, index) => {
            if (block.type !== "paragraph") return null;

            return (
              <p key={index}>
                {block.children?.map((child, childIndex) => (
                  <span key={childIndex}>{child.text}</span>
                ))}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}