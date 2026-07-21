export default function BringingClarity({ id, data }) {
  if (!data) return null;

  return (
    <section className="bringing-clarity" id={id}>
      <div className="container">
        <div className="bringing-clarity-in">
          <div className="heading">
            <h2>{data.headline}</h2>
          </div>

          <div className="list-wrap">
            <ul>
    {data?.bullet_item?.map((item) => (
      <li key={item.id}>{item.title}</li>
    ))}
  </ul>
          </div>
        </div>
      </div>
    </section>
  );
}