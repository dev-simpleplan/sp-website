export default function ApproachBranding() {
//   if (!data) return null;

  return (
    <section className="approach-section">
      <div className="container">
        <div className="approach-sec-in gap-left">
          <div className="heading">
            <h2 className="reveal-heading">We approach branding a little differently</h2>
          </div>

          <div className="list-wrap">
            {/* <ul>
              {data?.bullet_item?.map((item) => (
                <li key={item?.id}>{item?.title}</li>
              ))}
            </ul> */}
            <p className="approach-description split-reveal">
              Before design, before communication — we focus on defining the brand clearly. The rest becomes easier after that.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}