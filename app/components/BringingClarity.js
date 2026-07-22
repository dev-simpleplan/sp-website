export default function BringingClarity({ id, data }) {
  if (!data) return null;

  console.log("bullet_item:", data?.bullet_item);
  console.log("bullet_item:", data);

  return (
    <section className="bringing-clarity" id={id}>
      <div className="container">
        <div className="bringing-clarity-in gap-left">
          <div className="heading">
            <h2 className="reveal-heading">{data.headline}</h2>
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