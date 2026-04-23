
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Stats from "@/components/Stats";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandStory from "@/components/BrandStory";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
    <Hero/>
    <Categories/>
    <Stats />
    <FeaturedProducts />
    <BrandStory/>
    <Testimonials/>
    <Footer/>
   </>
  );
}
