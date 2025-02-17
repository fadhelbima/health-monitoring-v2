import React from "react";
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
  return (
    <Carousel className="mt-0 me-0 ms-0 mb-4">
      {newsData.map((news, index) => (
        <Carousel.Item key={index} interval={2000}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              height: "50vh", // 🔥 Proporsional
              overflow: "hidden",
              borderRadius: "10px", // 🔥 Perubahan: Membuat ujung carousel membulat
            }}
          >
            <img
              className="w-100"
              src={news.image}
              alt={news.title}
              style={{
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
                borderRadius: "10px", // 🔥 Perubahan: Membuat gambar juga memiliki sudut membulat
              }}
            />
          </div>
          <Carousel.Caption className="bg-dark bg-opacity-50 p-3 rounded">
            <h5>{news.title}</h5>
            <p>{news.description}</p>
            <a
              href={news.link}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Baca Selengkapnya
            </a>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;
