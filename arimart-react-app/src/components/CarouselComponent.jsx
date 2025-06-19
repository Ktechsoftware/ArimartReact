import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const slides = [
  'https://arimart.kuldeepchaurasia.in/Uploads/SAVE_20240920_115229_20240920115243.jpg', // add your image URLs
  '/images/slide2.png',
  '/images/slide3.png',
];

export default function CarouselComponent() {
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        loop
        className="h-64"
      >
        {slides.map((src, i) => (
          <SwiperSlide key={i}>
            <img src={src} alt={`slide-${i}`} className="w-full h-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
