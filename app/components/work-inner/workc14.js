export default function C14({ data }) {
  if (!data) return null;

  const columns = [
    data.text_1,
    data.text_2,
    data.text_3,
    data.text_4,
  ];

  const getText = (item) =>
    item?.children?.map((child) => child.text).join("");

  return (
    <section className="work-c14">
      <div className="work-c14__container not-full-width">
        {columns.map((column, index) => {
          if (!column?.length) return null;

          const heading = column.find(
            (item) => item.type === "heading" && item.level === 5
          );

          const paragraphs = column.filter(
            (item) => item.type === "paragraph"
          );

          return (
            <div className="work-c14__column" key={index}>
              {/* Column Heading */}
              {heading && (
                <h5 className="work-c14__heading">
                  {getText(heading)}
                </h5>
              )}

              {/* Column Content */}
              <div className="work-c14__content">
                {paragraphs.map((paragraph, paragraphIndex) => {
                  const text = getText(paragraph);

                  if (!text) return null;

                  return (
                    <p key={paragraphIndex}>
                      {text}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}