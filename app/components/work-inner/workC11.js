import Image from "next/image";

const getImageUrl = (image) => {
  if (!image?.url) return "";

  return image.url.startsWith("http")
    ? image.url
    : `${process.env.NEXT_PUBLIC_API_URL}${image.url}`;
};

export default function C11({ data }) {
  if (!data) return null;

  const leftImage = getImageUrl(data.left_image);
  const topRightImage = getImageUrl(data.top_right_image);
  const bottomRightImage = getImageUrl(data.bottom_right_image);

  return (
    <section
      className="work-c11"
      style={{
        "--work-bg-color": data.colour_code_bg || "#ffffff",
      }}
    >
      <div className="work-c11__grid">

        {/* Large Left Image */}
        {leftImage && (
          <div className="work-c11__item work-c11__item--large">
            <Image
              src={leftImage}
              alt={data.left_image?.alternativeText || ""}
              fill
              sizes="(max-width: 767px) 100vw, 66vw"
            />
          </div>
        )}

        {/* Top Right Image */}
        {topRightImage && (
          <div className="work-c11__item">
            <Image
              src={topRightImage}
              alt={data.top_right_image?.alternativeText || ""}
              fill
              sizes="(max-width: 767px) 100vw, 33vw"
            />
          </div>
        )}

        {/* Bottom Right Image */}
        {bottomRightImage && (
          <div className="work-c11__item">
            <Image
              src={bottomRightImage}
              alt={data.bottom_right_image?.alternativeText || ""}
              fill
              sizes="(max-width: 767px) 100vw, 33vw"
            />
          </div>
        )}

      </div>
    </section>
  );
}