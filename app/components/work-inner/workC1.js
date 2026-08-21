import { getImageUrl } from "../getImageUrl";

export default function C1FullImage({ data }) {
  const image = data?.image_for_desktop;
  if (!image) return null;

  return (
    <section className="work-c1">
      <img
        src={getImageUrl(image)}
        alt={image.alternativeText || ""}
        className="work-c1__image"
      />
    </section>
  );
}