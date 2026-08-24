export default function C14({ data }) {
  if (!data) return null;

  const columns = [
    data.text_1,
    data.text_2,
    data.text_3,
    data.text_4,
  ];

  const sectionStyle = data.colour_code_bg
    ? {
        "--work-bg-color": data.colour_code_bg,
      }
    : {};

  const getText = (item) =>
    item?.children?.map((child) => child.text).join("");

  const renderInlineContent = (item) =>
    item?.children?.map((child, index) => {
      const text = child?.text || "";

      if (!text) return null;

      if (child.bold && child.italic) {
        return (
          <strong key={index}>
            <em>{text}</em>
          </strong>
        );
      }

      if (child.bold) {
        return <strong key={index}>{text}</strong>;
      }

      if (child.italic) {
        return <em key={index}>{text}</em>;
      }

      return <span key={index}>{text}</span>;
    });

  /*
   * RESULT COLUMN
   *
   * API structure:
   *
   * heading
   * paragraph -> 2 cr
   * paragraph -> Funding Raised
   * paragraph -> empty
   * paragraph -> 80 %
   * paragraph -> Return Customers
   */
  const renderResultContent = (column) => {
    const paragraphs = column.filter(
      (item) => item.type === "paragraph"
    );

    const stats = [];

    let currentStat = null;

    paragraphs.forEach((paragraph) => {
      const text = getText(paragraph);

      // Empty paragraph separates two stats
      if (!text) {
        currentStat = null;
        return;
      }

      const hasItalic = paragraph.children?.some(
        (child) => child.italic
      );

      const hasBold = paragraph.children?.some(
        (child) => child.bold
      );

      /*
       * This paragraph is a stat value.
       * Example:
       * 2 cr
       * 80 %
       */
      if (hasItalic || hasBold) {
        currentStat = {
          value: paragraph,
          description: null,
        };

        stats.push(currentStat);
        return;
      }

      /*
       * Normal paragraph after a stat value
       * becomes that stat's description.
       */
      if (currentStat && !currentStat.description) {
        currentStat.description = paragraph;
      }
    });

    return (
      <div className="work-c14__content">
        {stats.map((stat, index) => (
          <div
            className="work-c14__stats-group"
            key={index}
          >
            {/* Stats Block */}
            <div className="work-c14__stats-block">
              {stat.value.children?.map(
                (child, childIndex) => {
                  const text = child?.text || "";

                  if (!text) return null;

                  if (child.italic) {
                    return (
                      <span
                        className="work-c14__stats-value"
                        key={childIndex}
                      >
                        {text}
                      </span>
                    );
                  }

                  if (child.bold) {
                    return (
                      <span
                        className="work-c14__stats-unit"
                        key={childIndex}
                      >
                        {text}
                      </span>
                    );
                  }

                  return (
                    <span key={childIndex}>
                      {text}
                    </span>
                  );
                }
              )}
            </div>

            {/* Description */}
            {stat.description && (
              <p className="work-c14__stats-description">
                {getText(stat.description)}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="work-c14" style={sectionStyle}>
      <div className="work-c14__container not-full-width">
        {columns.map((column, index) => {
          if (!column?.length) return null;

          const heading = column.find(
            (item) =>
              item.type === "heading" &&
              item.level === 5
          );

          const isResultColumn = index === 3;

          return (
            <div
              className={`work-c14__column${
                isResultColumn
                  ? " work-c14__column--result"
                  : ""
              }`}
              key={index}
            >
              {/* Column Heading */}
              {heading && (
                <h5 className="work-c14__heading">
                  {getText(heading)}
                </h5>
              )}

              {/* Result Column */}
              {isResultColumn ? (
                renderResultContent(column)
              ) : (
                /* Normal Columns */
                <div className="work-c14__content">
                  {column
                    .filter(
                      (item) =>
                        item.type === "paragraph"
                    )
                    .map(
                      (paragraph, paragraphIndex) => {
                        const text = getText(paragraph);

                        if (!text) return null;

                        return (
                          <p key={paragraphIndex}>
                            {renderInlineContent(
                              paragraph
                            )}
                          </p>
                        );
                      }
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}