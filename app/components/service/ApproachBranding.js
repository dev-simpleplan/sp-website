export default function ApproachBranding({id, data}) {
  if (!data) return null;

  return (
    <section className="approach-section" id={id}>
      <div className="container">
        <div className="approach-sec-in gap-left">
          <div className="heading">
            <h2 className="reveal-heading">{data?.title}</h2>
          </div>

          <div className="list-wrap">
            {/* <ul>
              {data?.bullet_item?.map((item) => (
                <li key={item?.id}>{item?.title}</li>
              ))}
            </ul> */}
            <p className="approach-description split-reveal">
              {data?.description?.[0]?.children?.[0]?.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}