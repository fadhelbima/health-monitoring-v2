import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const newsData = [
  {
    title: "WHO: Upaya Vaksinasi Global Meningkat",
    description:
      "Organisasi Kesehatan Dunia melaporkan peningkatan cakupan vaksinasi di berbagai negara.",
    image: "/Img/whocarousel1.jpg",
    link: "https://www.who.int/news/item/01-01-2024-vaccination-update",
  },
  {
    title: "Sakit Pinggang (Biasa vs Kanker)",
    description:
      "Waspadai flank pain (ketidaknyaman atau nyeri di perut bagian atas, punggung, dan pinggang). Ini mungkin terjadi ketika ginjal meradang atau karena tumor yang sedang tumbuh.",
    image: "/Img/carousel2.jpg",
    link: "https://www.idntimes.com/health/medical/nurulia-r-fitri/perbedaan-sakit-pinggang-biasa-dan-kanker-ginjal",
  },
  {
    title: "WHO Peringatkan Perubahan Iklim",
    description:
      "Dampak perubahan iklim terhadap kesehatan masyarakat semakin nyata dan perlu penanganan segera.",
    image: "/Img/carousel3.jpg",
    link: "https://www.who.int/news/item/01-03-2024-climate-change-health",
  },
];

const CarouselComponent = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideInterval = 4000; // 4 seconds per slide

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setActiveIndex((current) =>
          current === newsData.length - 1 ? 0 : current + 1
        );
      }
    }, slideInterval);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  return (
    <div
      className="carousel-container position-relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Carousel
        className="mt-0 mb-5"
        activeIndex={activeIndex}
        onSelect={handleSelect}
        interval={null} // Disable Bootstrap's built-in interval as we're handling it ourselves
        fade
      >
        {newsData.map((news, index) => (
          <Carousel.Item key={index}>
            <div
              className="carousel-image-container"
              style={{
                height: "60vh",
                overflow: "hidden",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              }}
            >
              <img
                className="w-100"
                src={news.image}
                alt={news.title}
                style={{
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  filter: "brightness(0.85)",
                  transition: "transform 0.5s ease-in-out",
                  transform: `scale(${activeIndex === index ? 1.05 : 1})`,
                }}
              />
              <div
                className="position-absolute bottom-0 start-0 end-0 p-4"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)",
                  borderBottomLeftRadius: "16px",
                  borderBottomRightRadius: "16px",
                  padding: "2rem 1.5rem",
                }}
              >
                <h4 className="fw-bold text-white mb-2">{news.title}</h4>
                <p className="text-white mb-3">{news.description}</p>
                <a
                  href={news.link}
                  className="btn btn-primary px-4 py-2 fw-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    borderRadius: "50px",
                    boxShadow: "0 4px 12px rgba(13, 110, 253, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.transform = "translateY(-2px)")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.transform = "translateY(0)")
                  }
                >
                  Baca Selengkapnya
                </a>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Progress bar indicator */}
      <div
        className="progress position-absolute w-100"
        style={{ bottom: "0", height: "4px", borderRadius: "0 0 16px 16px" }}
      >
        <div
          className="progress-bar bg-primary"
          role="progressbar"
          style={{
            width: isPaused
              ? `${
                  (activeIndex / newsData.length) * 100 + 100 / newsData.length
                }%`
              : "100%",
            transition: isPaused ? "none" : `width ${slideInterval}ms linear`,
            animationPlayState: isPaused ? "paused" : "running",
            animation: isPaused
              ? "none"
              : `progress-animation ${slideInterval}ms linear infinite`,
          }}
        />
      </div>

      {/* Custom dot indicators */}
      <div
        className="carousel-indicators-custom position-absolute d-flex justify-content-center w-100"
        style={{ bottom: "10px" }}
      >
        {newsData.map((_, index) => (
          <button
            key={index}
            className={`mx-1 border-0 rounded-circle ${
              activeIndex === index ? "bg-primary" : "bg-white"
            }`}
            style={{
              width: activeIndex === index ? "12px" : "8px",
              height: activeIndex === index ? "12px" : "8px",
              opacity: activeIndex === index ? 1 : 0.5,
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {/* Added pause/play indicator */}
      <div
        className="play-pause-indicator position-absolute"
        style={{
          top: "20px",
          right: "20px",
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          opacity: "0.7",
          transition: "opacity 0.3s ease",
        }}
        onClick={() => setIsPaused(!isPaused)}
        onMouseOver={(e) => (e.target.style.opacity = "1")}
        onMouseOut={(e) => (e.target.style.opacity = "0.7")}
      >
        <i
          className={`text-white ${
            isPaused ? "bi bi-play-fill" : "bi bi-pause-fill"
          }`}
          style={{ fontSize: "1.5rem" }}
        ></i>
      </div>

      <style jsx>{`
        @keyframes progress-animation {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CarouselComponent;
