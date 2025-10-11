"use client"; // This must be a client component to use hooks (useState, useEffect)

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// --- COMPONENT START ---
const Hero = () => {
  // --- SLIDE DATA ---
  // You can replace these URLs with paths to your images in the `public` folder, e.g., "/images/hero-1.jpg"
  const slides: {
    id: number;
    src: string; // Changed to string for URL paths
    alt: string;
    title: string;
    description: string;
    link: string;
  }[] = [
    {
      id: 1,
      src: 'https://placehold.co/1920x1080/334155/FFFFFF?text=New+Season+Arrivals',
      alt: 'Stylish apparel on display',
      title: 'New Season Arrivals',
      description: 'Check out the latest trends in our summer collection.',
      link: '/shop/',
    },
    {
      id: 2,
      src: 'https://placehold.co/1920x1080/475569/FFFFFF?text=Exclusive+Graphic+Tees',
      alt: 'Graphic t-shirt design',
      title: 'Exclusive Graphic Tees',
      description: "Limited edition designs you won't find anywhere else.",
      link: '/shop/',
    },
    {
      id: 3,
      src: 'https://placehold.co/1920x1080/64748B/FFFFFF?text=Sale+Up+to+40%25+Off',
      alt: 'Special edition printed t-shirt',
      title: 'Sale: Up to 40% Off!',
      description: "Grab your favorites before they're gone.",
      link: '/shop/',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };
  
  // Auto-play functionality
  useEffect(() => {
    const autoPlayInterval = setInterval(goToNext, 5000); // changes slide every 5 seconds
    return () => clearInterval(autoPlayInterval);
  }, [goToNext]);

  return (
    <div className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden">
      {/* Carousel Track */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {/* Each Slide */}
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-full min-w-full">
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover brightness-[0.6]" // Replaced Next/Image with standard img
            />
            {/* Text content on the slide */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
              <h2 className="text-4xl md:text-6xl font-extrabold drop-shadow-md">
                {slide.title}
              </h2>
              <p className="mt-4 text-lg md:text-xl max-w-lg drop-shadow-md">
                {slide.description}
              </p>
              {/* Replaced Next/Link with standard anchor tag */}
              <a href={slide.link} className="mt-6 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors duration-300">
                Shop Now
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button 
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 p-3 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      {/* Right Arrow */}
      <button 
        onClick={goToNext}
        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 p-3 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 space-x-3">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${slideIndex + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Hero;

