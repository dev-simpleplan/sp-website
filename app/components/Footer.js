import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    id: "pages",
    title: "Pages",
    links: ["Our Work", "Blogs", "Privacy Policy", "Terms & Conditions"],
  },
  {
    id: "about",
    title: "About",
    links: ["Our Company", "Our Culture", "Our Team", "SP For Good"],
  },
  {
    id: "socials",
    title: "Socials",
    links: [
      "Instagram",
      "Twitter",
      "LinkedIn",
      "YouTube",
      "Behance",
      "Dribble",
    ],
  },
];

const ARROW_UP_RIGHT = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M4 12L12 4M12 4H5M12 4V11"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.spFooter}>
      <div className={styles.spFooterWatermark} aria-hidden="true">
        <Image src="/spVector.svg" alt="Watermark" width={100} height={100} />
      </div>

      <div className={styles.spFooterInner}>
        <div className={styles.spFooterHero}>
          <h2 className={styles.spFooterHeading}>
            Ready To Build Your Brand
            <br />
            The Right Way?
          </h2>

          <p className={styles.spFooterSubtext}>
            Start with clarity, then build a brand that doesn&apos;t
            <br />
            need to be reworked every time you grow.
          </p>

          <Link href="/contact" className={`custom-btn ${styles.spBookCallBtn}`}>
            <span>Book a Call</span>
            <span className="arrow-wrap">
                  <svg className="arrow arrow-1" width="12" height="12" viewBox="0 0 12 12" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                      <path
                            d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                            fill="currentColor" />
                  </svg>

                  <svg className="arrow arrow-2" width="12" height="12" viewBox="0 0 12 12" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                      <path
                            d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z"
                            fill="currentColor" />
                  </svg>
              </span>
          </Link>
        </div>

        <div className={styles.spFooterColumns}>
          {FOOTER_COLUMNS.map((column) => (
            <div className={styles.spFooterColumn} key={column.id}>
              <p className={styles.spFooterColumnTitle}>{column.title}</p>
              <ul className={styles.spFooterLinkList}>
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className={styles.spFooterLink}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={styles.spFooterColumn}>
            <p className={styles.spFooterColumnTitle}>Contact Us</p>
            <ul className={styles.spFooterLinkList}>
              <li>
                <a
                  href="mailto:hello@simpleplanmedia.com"
                  className={styles.spFooterLink}
                >
                  hello@simpleplanmedia.com
                </a>
              </li>
              <li>
                <a href="tel:+919811053528" className={styles.spFooterLink}>
                  +91 - 9811-053-528
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.spFooterBottom}>
          <p className={styles.spFooterCopyright}>
            <span className={styles.spCopyrightIcon}>&#169;</span>
            {` ${year} SimplePlan Media`}
          </p>
          <p className={styles.spFooterCredit}>
            Made With <span className={styles.spHeart}>❤️</span> In India
          </p>
        </div>
      </div>
    </footer>
  );
}