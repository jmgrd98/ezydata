import React from 'react'
import { Card } from '../ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel'
import Autoplay from "embla-carousel-autoplay"
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

interface Testimonial {
  quote: string
  name: string
  role: string
}

const LandingFeedback = () => {
  const { t } = useTranslation();

  const plugin = React.useRef(
    Autoplay({ 
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const testimonials = t('landing.landingFeedback.testimonials', { returnObjects: true }) as Testimonial[];

  return (
    <div className='bg-black text-white py-12 px-4 sm:px-6 lg:px-8'>
      <div className="max-w-7xl mx-auto relative group">
        <Carousel
          plugins={[plugin.current]}
          className="w-full overflow-hidden"
          opts={{
            align: "start",
            loop: true,
            duration: 50,
          }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={(event) => {
            console.log(event)
            plugin.current.play()
          }}
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem 
                key={index}
                className="pl-4 basis-full md:basis-1/3 lg:basis-1/3"
              >
                <div className="p-2">
                  <Card className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl h-full hover:border-gray-600 transition-all">
                    <p className="text-lg sm:text-xl italic text-gray-300 mb-6">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <Image 
                          src={`/assets/people-testimonials/person${index + 1}.jpg`}
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-lg font-bold">{testimonial.name}</h3>
                        <p className="text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="hidden md:block">
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800/80 text-white h-12 w-12 rounded-full shadow-lg backdrop-blur-sm transition-all opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 duration-200 pointer-events-none group-hover:pointer-events-auto" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800/80 text-white h-12 w-12 rounded-full shadow-lg backdrop-blur-sm transition-all opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 duration-200 pointer-events-none group-hover:pointer-events-auto" />
          </div>
        </Carousel>
      </div>
    </div>
  )
}

export default LandingFeedback