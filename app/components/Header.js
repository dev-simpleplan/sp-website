"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./header.module.css";
import MainLogo from "./images/logo.png";
import Image from "next/image";
import Link from "next/link";
import "../globals.css";
import "../custom.css";
import "../responsive.css";

const MEGA_MENU_DATA = [
  {
    id: "branding",
    title: "Branding",
    links: [
      "Logo and Visual Identity",
      "Brand Positioning",
      "Strategy & Messaging",
      "Print & Packaging Design",
      "Brand Videos & Photography",
    ],
  },
  {
    id: "marketing",
    title: "Marketing & Content",
    links: [
      "Digital Marketing",
      "Website Content",
      "Brand Copywriting",
      "Social Media Marketing",
      "Video Production",
      "Performance Marketing",
    ],
  },
  {
    id: "websites",
    title: "Websites & Apps",
    links: [
      "Website Development",
      "UI/UX Design",
      "Web Application Development",
      "Mobile App Development",
      "Shopify & E-commerce Development",
    ],
  },
];

const CHEVRON_DOWN = (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
    <path
      d="M1 1.5L6 6.5L11 1.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CHEVRON_RIGHT = (
  <svg width="18" height="14" viewBox="0 0 14 12" fill="none" aria-hidden="true">
    <path
      d="M1 1L7 6L1 11"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ARROW_UP_RIGHT = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M3 11L11 3M11 3H4M11 3V10"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Header() {
  const [isWhatWeDoOpen, setIsWhatWeDoOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsWhatWeDoOpen(false);
        setIsAboutUsOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsWhatWeDoOpen(false);
        setIsAboutUsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function toggleWhatWeDo() {
    setIsWhatWeDoOpen((prev) => !prev);
    setIsAboutUsOpen(false);
  }

  function toggleAboutUs() {
    setIsAboutUsOpen((prev) => !prev);
    setIsWhatWeDoOpen(false);
  }

  return (
    <header className={styles.spHeader} ref={headerRef}>
      <div className={styles.spHeaderBar}>
        <Link href="/" className={styles.spLogo}>
  <Image src={MainLogo} alt="SimplePlan Logo" />
</Link>

        <nav className={styles.spNav} aria-label="Primary">
          <button
            type="button"
            className={`${styles.spNavItem} ${
              isWhatWeDoOpen ? styles.spNavItemActive : ""
            }`}
            aria-expanded={isWhatWeDoOpen}
            onClick={toggleWhatWeDo}
          >
            <span>What We Do</span>
            <span
              className={`${styles.spChevron} ${
                isWhatWeDoOpen ? styles.spChevronOpen : ""
              }`}
            >
              {CHEVRON_DOWN}
            </span>
          </button>

          <button
            type="button"
            className={`${styles.spNavItem} ${
              isAboutUsOpen ? styles.spNavItemActive : ""
            }`}
            aria-expanded={isAboutUsOpen}
            onClick={toggleAboutUs}
          >
            <span>About Us</span>
            <span
              className={`${styles.spChevron} ${
                isAboutUsOpen ? styles.spChevronOpen : ""
              }`}
            >
              {CHEVRON_DOWN}
            </span>
          </button>

          <a href="/our-work" className={styles.spNavLink}>
            Our Work
          </a>
        </nav>
      </div>

      <div
        className={`${styles.spMegaMenu} ${
          isWhatWeDoOpen ? styles.spMegaMenuOpen : ""
        }`}
      >
        <div className={styles.spMegaMenuInner}>
          <div className={styles.spMegaMenuTop}>
            <div className={styles.spMegaMenuColumns}>
              {MEGA_MENU_DATA.map((column) => (
                <div className={styles.spMegaMenuColumn} key={column.id}>
                  <a href="#" className={styles.spMegaMenuColumnTitle}>
                    <span>{column.title}</span>
                    <span className={styles.spMegaMenuColumnArrow}>
                      {CHEVRON_RIGHT}
                    </span>
                  </a>
                  <ul className={styles.spMegaMenuLinkList}>
                    {column.links.map((link) => (
                      <li key={link}>
                        <a href="#" className={styles.spMegaMenuLink}>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className={styles.spMegaMenuImageWrap}>
              <Image
                className={styles.spMegaMenuImage}
                src="/dropdown-image.png"
                alt="The simpleplan team"
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>
        <div className={styles.spMegaBg}></div>
      </div>

      <div
        className={`${styles.spMegaMenu} ${
          isAboutUsOpen ? styles.spMegaMenuOpen : ""
        }`}
      >
        <div className={styles.spMegaMenuInner}>
          <p className={styles.spMegaMenuEmpty}>No items to show yet.</p>
        </div>
        <div className={styles.spMegaBg}></div>
      </div>
    </header>
  );
}