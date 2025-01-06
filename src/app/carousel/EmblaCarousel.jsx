import React, { useEffect, useState, useRef } from "react";
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

const EmblaCarousel_ = (props) => {
  const {slides, options, custom_settings, className} = props
  const autoPlay = custom_settings["autoPlay"] ? Autoplay({ playOnInit: true, delay: 10000 }) : null;
  const plugins = autoPlay ? [autoPlay] : [];
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);
  
  useEffect(() => {
    if (emblaApi) {
      // Access API   
      // console.log("HI", emblaApi.slideNodes());
    }
  }, [emblaRef, options]);
  

  // Rest of code
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <div className={`embla flex flex-col justify-center items-center gap-10 ${className}`} ref={emblaRef}>
      <div className="embla__container w-full">
        {slides.map((slide, index) => (
          <div className="embla__slide" key={index}>
              {slide}
              {/* <div className="size-16 bg-black"></div> */}
          </div>
        ))}
      </div>

      <div className="embla__controls justify-center flex flex-wrap gap-32">
        {/* Arrows */}
        <div className="embla__buttons flex gap-16">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
        {/* Dots */}
        <div className="embla__dots flex justify-center items-center gap-5">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`bg-transparent rounded-full border-2 size-4 ${selectedIndex === index ? 'border-white' : 'border-gray'} ${index === selectedIndex ? 'embla__dot embla__dot--selected' : 'embla__dot'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel_
