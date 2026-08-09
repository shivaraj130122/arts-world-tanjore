import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import ProductCard from "../product/ProductCard";
import { newArrivals } from "../../constants/products";

const NewArrivals = () => {
  if (newArrivals.length === 0) return null;

  return (
    <section className="section-y bg-white">
      <Container>
        <SectionTitle
          eyebrow="Just In"
          title="New Arrivals"
          description="Fresh creations inspired by tradition and imagination."
        />

        <div className="new-arrivals-swiper mt-12">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.15}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              480: { slidesPerView: 1.5 },
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.2 },
              1280: { slidesPerView: 4 },
            }}
            className="!pb-12"
          >
            {newArrivals.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>

      {/* Scoped overrides so Swiper's default nav/pagination match the theme */}
      <style>{`
        .new-arrivals-swiper .swiper-button-next,
        .new-arrivals-swiper .swiper-button-prev {
          color: var(--color-primary);
          background: var(--color-background);
          width: 38px;
          height: 38px;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .new-arrivals-swiper .swiper-button-next::after,
        .new-arrivals-swiper .swiper-button-prev::after {
          font-size: 14px;
          font-weight: 700;
        }
        .new-arrivals-swiper .swiper-pagination-bullet-active {
          background: var(--color-secondary);
        }
      `}</style>
    </section>
  );
};

export default NewArrivals;
