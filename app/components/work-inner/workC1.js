import { getImageUrl } from "../getImageUrl";

export default function C1FullImage({ data }) {
  const desktopImage = data?.image_for_desktop;
  const mobileImage = data?.image_for_mobile || desktopImage; // fallback agar mobile image missing ho

  if (!desktopImage) return null;

  return (
    <section className="work-c1">
      <picture>
        {/* 768px se upar (tablet/desktop) => desktop image */}
        <source
          media="(min-width: 768px)"
          srcSet={getImageUrl(desktopImage)}
        />
        {/* Default / fallback => mobile image (browser tab pe ye load hoga jab
            koi <source> match nahi hota, matlab niche 768px pe) */}
        <img
          src={getImageUrl(mobileImage)}
          alt={desktopImage.alternativeText || mobileImage.alternativeText || ""}
          className="work-c1__image"
        />
      </picture>
    </section>
  );
}