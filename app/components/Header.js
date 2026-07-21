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

const CLIENT_LOGOS = [
  "KEY LIST",
  "Haldiram's",
  "INVOGUE",
  "JOSH TALKS",
  "LumiRed",
  "Makers Hive",
  "AUX",
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

const ARROW_LEFT = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M11 1L4 7L11 13"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CLOSE_ICON = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M1 1L17 17M17 1L1 17"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

// How long to wait before actually closing a hover-opened menu — gives the
// user time to move the cursor from the nav button down into the panel
// without it snapping shut in the gap between them.
const CLOSE_DELAY_MS = 200;

export default function Header() {
  const [isWhatWeDoOpen, setIsWhatWeDoOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState("root"); // "root" | "what-we-do" | "about-us"
  const headerRef = useRef(null);
  const [isInStickySection, setIsInStickySection] = useState(false);
  const headerBarRef = useRef(null);
  
  const closeTimeoutRef = useRef(null);

  const isAnyDesktopMenuOpen = isWhatWeDoOpen || isAboutUsOpen;
  const isAnyMenuOpen = isAnyDesktopMenuOpen || isMobileMenuOpen;

  // Close desktop dropdowns on outside click / Escape (kept as a safety net
  // alongside hover — useful for touch/keyboard users)
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
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

// Hide the header only once the sticky section's TOP edge has actually
// reached the top of the viewport (i.e. it's about to start behaving
// sticky) — not merely when it first enters view. Header comes back the
// moment the section's bottom edge scrolls past the top (fully cleared).
useEffect(() => {
  let ticking = false;

  function checkStickySections() {
    // Never hide on/near the very top of the page — this is what was
    // wrongly hiding the header over the home banner, since a section
    // sitting at document y=0 has rect.top === 0 from the first frame,
    // before the user has scrolled at all.
    if (window.scrollY <= 0) {
      setIsInStickySection(false);
      return;
    }

    const stickyEls = document.querySelectorAll("[data-sticky-section]");
    let anyActive = false;

    stickyEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Section's top has reached (or passed) the viewport top, AND it
      // hasn't fully scrolled past yet.
      if (rect.top <= 0 && rect.bottom > 0) {
        anyActive = true;
      }
    });

    setIsInStickySection(anyActive);
  }

  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkStickySections();
        ticking = false;
      });
      ticking = true;
    }
  }

  checkStickySections();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleScroll);
  };
}, []);

  // Sticky header: toggle a "scrolled" state once the user scrolls past a
  // small threshold.
  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock page scroll while the mobile menu overlay is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Clear any pending close timer on unmount
  useEffect(() => {
    return () => clearTimeout(closeTimeoutRef.current);
  }, []);

  function openMenu(menu) {
    clearTimeout(closeTimeoutRef.current);
    if (menu === "what-we-do") {
      setIsWhatWeDoOpen(true);
      setIsAboutUsOpen(false);
    } else {
      setIsAboutUsOpen(true);
      setIsWhatWeDoOpen(false);
    }
  }

  function scheduleClose() {
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setIsWhatWeDoOpen(false);
      setIsAboutUsOpen(false);
    }, CLOSE_DELAY_MS);
  }

  function cancelScheduledClose() {
    clearTimeout(closeTimeoutRef.current);
  }

  function openMobileMenu() {
    setMobileView("root");
    setIsMobileMenuOpen(true);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
    setMobileView("root");
  }

  return (
    <header
  className={`${styles.spHeader} ${
    isScrolled ? styles.spHeaderScrolled : ""
  } ${isAnyMenuOpen ? styles.spHeaderMenuOpen : ""} ${
    isInStickySection ? styles.spHeaderHidden : ""
  }`}
  ref={headerRef}
>
      <div className={styles.spHeaderBar} ref={headerBarRef}>
  <Link href="/" className={styles.spLogo}>
    <Image src={MainLogo} alt="SimplePlan Logo" />
  </Link>

  {/* Two crossfading layers occupying the exact same box — nothing here
      ever changes width/margin/position via a toggled class, so there is
      nothing for the browser to "snap". Only opacity/transform animate,
      which is always smooth. */}
  <div className={styles.spNavClusterWrap}>

    {/* Layer 1 — default state: nav flush right, no CTA */}
    <div
      className={`${styles.spNavCluster} ${
        !isScrolled ? styles.spNavClusterActive : ""
      }`}
    >
      <nav className={styles.spNav} aria-label="Primary">
        <button
          type="button"
          className={`${styles.spNavItem} ${isWhatWeDoOpen ? styles.spNavItemActive : ""}`}
          aria-expanded={isWhatWeDoOpen}
          onMouseEnter={() => openMenu("what-we-do")}
          onMouseLeave={scheduleClose}
          onFocus={() => openMenu("what-we-do")}
          onBlur={scheduleClose}
        >
          <span>What We Do</span>
          <span className={`${styles.spChevron} ${isWhatWeDoOpen ? styles.spChevronOpen : ""}`}>
            {CHEVRON_DOWN}
          </span>
        </button>

        <button
          type="button"
          className={`${styles.spNavItem} ${isAboutUsOpen ? styles.spNavItemActive : ""}`}
          aria-expanded={isAboutUsOpen}
          onMouseEnter={() => openMenu("about-us")}
          onMouseLeave={scheduleClose}
          onFocus={() => openMenu("about-us")}
          onBlur={scheduleClose}
        >
          <span>About Us</span>
          <span className={`${styles.spChevron} ${isAboutUsOpen ? styles.spChevronOpen : ""}`}>
            {CHEVRON_DOWN}
          </span>
        </button>

        <a href="/our-work" className={styles.spNavLink}>Our Work</a>
      </nav>
    </div>

    {/* Layer 2 — scrolled/sticky state: nav centered, CTA visible on the right */}
    <div
      className={`${styles.spNavCluster} ${styles.spNavClusterSticky} ${
        isScrolled ? styles.spNavClusterActive : ""
      }`}
    >
      <nav className={styles.spNav} aria-label="Primary">
        <button
          type="button"
          className={`${styles.spNavItem} ${isWhatWeDoOpen ? styles.spNavItemActive : ""}`}
          aria-expanded={isWhatWeDoOpen}
          onMouseEnter={() => openMenu("what-we-do")}
          onMouseLeave={scheduleClose}
          onFocus={() => openMenu("what-we-do")}
          onBlur={scheduleClose}
        >
          <span>What We Do</span>
          <span className={`${styles.spChevron} ${isWhatWeDoOpen ? styles.spChevronOpen : ""}`}>
            {CHEVRON_DOWN}
          </span>
        </button>

        <button
          type="button"
          className={`${styles.spNavItem} ${isAboutUsOpen ? styles.spNavItemActive : ""}`}
          aria-expanded={isAboutUsOpen}
          onMouseEnter={() => openMenu("about-us")}
          onMouseLeave={scheduleClose}
          onFocus={() => openMenu("about-us")}
          onBlur={scheduleClose}
        >
          <span>About Us</span>
          <span className={`${styles.spChevron} ${isAboutUsOpen ? styles.spChevronOpen : ""}`}>
            {CHEVRON_DOWN}
          </span>
        </button>

        <a href="/our-work" className={styles.spNavLink}>Our Work</a>
      </nav>

      <Link href="/contact" className={`custom-btn ${styles.spHeaderCta}`}>
        <span>Book A Call</span>
        <span className="arrow-wrap">
          <svg className="arrow arrow-1" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z" fill="currentColor" />
          </svg>
          <svg className="arrow arrow-2" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.878125 11.6667L0 10.7885L9.53854 1.25H3.75V0H11.6667V7.91667H10.4167V2.12813L0.878125 11.6667Z" fill="currentColor" />
          </svg>
        </span>
      </Link>
    </div>
  </div>

  {/* Mobile hamburger trigger */}
  <button
    type="button"
    className={`${styles.spHamburgerBtn} ${isMobileMenuOpen ? styles.spHamburgerBtnOpen : ""}`}
    aria-label="Open menu"
    aria-expanded={isMobileMenuOpen}
    onClick={openMobileMenu}
  >
    <span className={styles.spHamburgerBar}></span>
    <span className={styles.spHamburgerBar}></span>
    <span className={styles.spHamburgerBar}></span>
  </button>
</div>

      {/* Desktop mega menu — What We Do */}
      <div
        className={`${styles.spMegaMenu} ${
          isWhatWeDoOpen ? styles.spMegaMenuOpen : ""
        }`}
        onMouseEnter={cancelScheduledClose}
        onMouseLeave={scheduleClose}
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

        {/* Bottom bar shown inside the overlay area below the dropdown,
            matching the reference design (CTA + client logos) */}
        <div className={styles.spMegaMenuBottom}>
          <div className={styles.spMegaMenuCtas}>
            <a href="/contact" className={styles.spBookCallBtn}>
              <span>Book a Call</span>
              <span className={styles.spBookCallIcon}>{ARROW_UP_RIGHT}</span>
            </a>
            <a href="/our-work" className={styles.spSeeWorkLink}>
              See Our Work
            </a>
          </div>

          <ul className={styles.spClientLogos}>
            {CLIENT_LOGOS.map((logo) => (
              <li key={logo} className={styles.spClientLogo}>
                {logo}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Desktop mega menu — About Us */}
      <div
        className={`${styles.spMegaMenu} ${
          isAboutUsOpen ? styles.spMegaMenuOpen : ""
        }`}
        onMouseEnter={cancelScheduledClose}
        onMouseLeave={scheduleClose}
      >
        <div className={styles.spMegaMenuInner}>
          <p className={styles.spMegaMenuEmpty}>No items to show yet.</p>
        </div>
      </div>

      {/* Single shared dim overlay for BOTH desktop mega menus — replaces
          the old per-menu overlay so only one exists in the DOM at a time */}
      <div
        className={`${styles.spMegaBg} ${
          isAnyDesktopMenuOpen ? styles.spMegaBgOpen : ""
        }`}
        onClick={() => {
          setIsWhatWeDoOpen(false);
          setIsAboutUsOpen(false);
        }}
      ></div>

      {/* Mobile menu overlay */}
      <div
        className={`${styles.spMobileOverlay} ${
          isMobileMenuOpen ? styles.spMobileOverlayOpen : ""
        }`}
      >
        <div className={styles.spMobileHeader}>
          <Link href="/" className={styles.spLogo} onClick={closeMobileMenu}>
            <Image src={MainLogo} alt="SimplePlan Logo" />
          </Link>

          <button
            type="button"
            className={styles.spMobileClose}
            aria-label="Close menu"
            onClick={closeMobileMenu}
          >
            {CLOSE_ICON}
          </button>
        </div>

        {/* Root list: What We Do / About Us / Our Work */}
        {mobileView === "root" && (
          <div className={styles.spMobileBody} key="root">
            <ul className={styles.spMobileList}>
              <li className={styles.spMobileItem}>
                <button
                  type="button"
                  className={styles.spMobileItemBtn}
                  onClick={() => setMobileView("what-we-do")}
                >
                  <span>What We Do</span>
                  <span className={styles.spMobileChevron}>
                    {CHEVRON_RIGHT}
                  </span>
                </button>
              </li>
              <li className={styles.spMobileItem}>
                <button
                  type="button"
                  className={styles.spMobileItemBtn}
                  onClick={() => setMobileView("about-us")}
                >
                  <span>About Us</span>
                  <span className={styles.spMobileChevron}>
                    {CHEVRON_RIGHT}
                  </span>
                </button>
              </li>
              <li className={styles.spMobileItemNoBorder}>
                <a
                  href="/our-work"
                  className={styles.spMobileItemBtn}
                  onClick={closeMobileMenu}
                >
                  <span>Our Work</span>
                </a>
              </li>
            </ul>

            <a href="#" className={styles.spMobileCta}>
              <span>Book a Call</span>
              <span className={styles.spBookCallIcon}>{ARROW_UP_RIGHT}</span>
            </a>
          </div>
        )}

        {/* What We Do drill-down */}
        {mobileView === "what-we-do" && (
          <div className={styles.spMobileBody} key="what-we-do">
            <button
              type="button"
              className={styles.spMobileBackBtn}
              onClick={() => setMobileView("root")}
            >
              <span className={styles.spMobileBackIcon}>{ARROW_LEFT}</span>
              <span>What We Do</span>
            </button>
            <div className={styles.spMobileSubList}>
              {MEGA_MENU_DATA.map((column) => (
                <div className={styles.spMobileGroup} key={column.id}>
                  <a href="#" className={styles.spMobileGroupTitle}>
                    <span>{column.title}</span>
                    <span className={styles.spMobileChevron}>
                      {CHEVRON_RIGHT}
                    </span>
                  </a>
                  <ul className={styles.spMobileGroupLinks}>
                    {column.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className={styles.spMobileGroupLink}
                          onClick={closeMobileMenu}
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About Us drill-down */}
        {mobileView === "about-us" && (
          <div className={styles.spMobileBody} key="about-us">
            <button
              type="button"
              className={styles.spMobileBackBtn}
              onClick={() => setMobileView("root")}
            >
              <span className={styles.spMobileBackIcon}>{ARROW_LEFT}</span>
              <span>About Us</span>
            </button>
            <p className={styles.spMegaMenuEmpty}>No items to show yet.</p>
          </div>
        )}
      </div>
    </header>
  );
}