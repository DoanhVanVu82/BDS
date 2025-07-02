import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return visible ? (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        right: 24,
        bottom: 32,
        zIndex: 9999,
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        width: 48,
        height: 48,
        fontSize: 24,
        boxShadow: "0 2px 8px #0002",
        cursor: "pointer",
        transition: "opacity 0.2s"
      }}
      aria-label="Cuộn lên đầu trang"
      title="Cuộn lên đầu trang"
    >
      ↑
    </button>
  ) : null;
};

export default ScrollToTopButton; 