"use client";

import { useEffect, useState } from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

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

function normalizeLink(link) {
  return !link || link === "#" || link === "#!" ? "#" : link;
}

export default function Footer() {
  const year = new Date().getFullYear();
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        const response = await axios.get(
          "http://72.61.235.119:1337/api/footer?populate[pages_menu]=true&populate[about_menu]=true&populate[social_link_menu]=true&populate[contact_us_menu]=true"
        );

        setFooterData(response.data?.data || null);
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    }

    fetchFooterData();
  }, []);

  const footerColumns = [
    {
      id: "pages",
      title: "Pages",
      links: footerData?.pages_menu || [],
    },
    {
      id: "about",
      title: "About",
      links: footerData?.about_menu || [],
    },
    {
      id: "socials",
      title: "Socials",
      links: footerData?.social_link_menu || [],
    },
  ];

  const contactLinks = footerData?.contact_us_menu || [
    {
      id: "email",
      item_name: "hello@simpleplanmedia.com",
      item_link: "mailto:hello@simpleplanmedia.com",
    },
    {
      id: "phone",
      item_name: "+91 - 9811-053-528",
      item_link: "tel:+919811053528",
    },
  ];

  return (
    <footer className={styles.spFooter} data-hide-side-rails>
      <div className={styles.spFooterWatermark} aria-hidden="true">
        <Image src="/spVector.svg" alt="Watermark" width={100} height={100} />
      </div>

      <div className="container">
        <div className={styles.spFooterInner}>
          <div className="spFooterHero gap-left">
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
            {footerColumns.map((column) => (
              <div className={styles.spFooterColumn} key={column.id}>
                <p className={styles.spFooterColumnTitle}>{column.title}</p>
                <ul className={styles.spFooterLinkList}>
                  {column.links.map((link) => (
                    <li key={link.id}>
                      <a href={normalizeLink(link.item_link)} className={styles.spFooterLink}>
                        <span className={styles.spFooterTextWrap}>
                          <span className={styles.spFooterText1}>{link.item_name}</span>
                          <span className={styles.spFooterText2}>{link.item_name}</span>
                      </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className={styles.spFooterColumn}>
              <p className={styles.spFooterColumnTitle}>Contact Us</p>
              <ul className={styles.spFooterLinkList}>
                {contactLinks.map((link) => (
                  <li key={link.id}>
                    <a href={normalizeLink(link.item_link)} className={styles.spFooterLink}>
                      {link.item_name}
                    </a>
                  </li>
                ))}
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
      </div>
    </footer>
  );
}