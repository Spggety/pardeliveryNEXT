"use client";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useEffect, useState } from "react";
import "./Banner.css";
import Image from "next/image";
const Banner = () => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 600px)");
    setMatches(mediaQuery.matches);
    const handleWindowResize = () => setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleWindowResize);
    return () => mediaQuery.removeEventListener("change", handleWindowResize);
  }, []);

  return (
    <div className="Banner">
      <Carousel
        infiniteLoop={true}
        emulateTouch={true}
        labels={false}
        showThumbs={false}
        showStatus={false}
        showArrows={false}
        centerMode
        centerSlidePercentage={matches ? 60 : 100}
        autoPlay
      >
        <img quality={100} src="/images/banner/banner.png" alt="Баннер" />
        <img quality={100} src="/images/banner/ban1.png" alt="Баннер" />
        <img quality={100} src="/images/banner/ban2.png" alt="Баннер" />
        <img quality={100} src="/images/banner/ban3.png" alt="Баннер" />
        <img quality={100} src="/images/banner/ban4.png" alt="Баннер" />
      </Carousel>
    </div>
  );
};

export default Banner;
