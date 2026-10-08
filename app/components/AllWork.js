"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import arrowIcon from "./images/arrow-down.png";
import { getImageUrl } from "./getImageUrl";

const BATCH_SIZE = 6;
const LOCK_DURATION = 1000; // ms - how long the scroll feels "stuck"

export default function AllWork() {
  const [workItems, setWorkItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLocked, setIsLocked] = useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside it
    useEffect(() => {
    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setIsDropdownOpen(false);
    };

  // Fetch works + categories from Strapi
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [worksRes, catsRes] = await Promise.all([
          fetch("/api/works"),
          fetch("/api/work-categories"),
        ]);
        const worksJson = worksRes.ok ? await worksRes.json() : { data: [] };
        const catsJson = catsRes.ok ? await catsRes.json() : { data: [] };
        if (cancelled) return;

        setWorkItems(
          (worksJson.data || []).map((w) => ({
            id: w.slug,
            title: w.title,
            categories: (w.work_categories || []).map((c) => c.name),
            description: w.short_description,
            image: getImageUrl(w.featured_image, "large"),
          }))
        );
        setCategories(["All", ...(catsJson.data || []).map((c) => c.name)]);
      } catch (error) {
        console.error("AllWork fetch error:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sentinelRef = useRef(null);
  const lockActiveRef = useRef(false); // prevents re-triggering while already locked/loading
  const preventScrollRef = useRef(null); // stores the handler so we can remove the exact same reference

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return workItems;
    return workItems.filter((item) => item.categories.includes(activeCategory));
  }, [activeCategory, workItems]);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [activeCategory]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  // Blocks wheel / touch / keyboard scrolling without jumping the page
  const lockScroll = () => {
    const preventDefault = (e) => e.preventDefault();
    preventScrollRef.current = preventDefault;

    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("keydown", handleKeyScroll, { passive: false });
  };

  const unlockScroll = () => {
    if (preventScrollRef.current) {
      window.removeEventListener("wheel", preventScrollRef.current);
      window.removeEventListener("touchmove", preventScrollRef.current);
    }
    window.removeEventListener("keydown", handleKeyScroll);
    preventScrollRef.current = null;
  };

  const handleKeyScroll = (e) => {
    const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", " "];
    if (scrollKeys.includes(e.key)) e.preventDefault();
  };

  // Trigger: reaching the sentinel (last card) locks scroll, waits, then reveals next batch
  useEffect(() => {
    if (!hasMore) return;

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !lockActiveRef.current) {
          lockActiveRef.current = true;
          setIsLocked(true);
          lockScroll();

          setTimeout(() => {
            setVisibleCount((prev) => prev + BATCH_SIZE);
            unlockScroll();
            setIsLocked(false);
            lockActiveRef.current = false;
          }, LOCK_DURATION);
        }
      },
      { threshold: 0.4 } // triggers once the last card is meaningfully in view
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      unlockScroll();
    };
  }, [hasMore]);

  return (
    <section className="all-work">
      <div className="container">
        <div className="all-work-in">
          <div className="all-work__header">
            <h2 className="all-work__heading">All Projects</h2>

            <div className="all-work__filter" ref={dropdownRef}>
                <span className="all-work__filter-label">Filter:</span>

                <div className="custom-select">
                    <button
                        type="button"
                        className={"custom-select__trigger" + (isDropdownOpen ? " is-open" : "")}
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                    >
                        {activeCategory}
                        <div className="custom-select__arrow">
                            <img src={arrowIcon.src}/>
                        </div>
                    </button>

                    <ul
                        className={"custom-select__list" + (isDropdownOpen ? " is-open" : "")}
                    >
                    {categories.map((category) => (
                        <li key={category}>
                        <button
                            type="button"
                            className={
                            "custom-select__option" +
                            (category === activeCategory ? " is-active" : "")
                            }
                            onClick={() => handleCategorySelect(category)}
                        >
                            {category}
                        </button>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
          </div>

          {isLoading ? (
            <p className="all-work__empty">Loading projects...</p>
          ) : filteredItems.length === 0 ? (
            <p className="all-work__empty">No projects found in this category.</p>
          ) : (
            <>
              <div className={"all-work__grid" + (isLocked ? " is-loading" : "")}>
                {visibleItems.map((item, index) => {
                  const isFull = index % 5 === 0;
                  const cardClassName =
                    "all-work__card " +
                    (isFull ? "all-work__card--full" : "all-work__card--half");

                  return (
                    <a
                      href={"/work/" + item.id}
                      key={item.id}
                      className={cardClassName}
                    >
                      <div className="all-work__image-wrap">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="all-work__image"
                        />
                        {item.categories[0] && (
                          <span className="all-work__tag">{item.categories[0]}</span>
                        )}
                      </div>

                      <div className="all-work-cardInfo">
                        <h3 className="all-work__title">{item.title}</h3>
                        <p className="all-work__desc">{item.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {hasMore && <div ref={sentinelRef} className="all-work__sentinel" />}
            </>
          )}
        </div>
      </div>
    </section>
  );
}