import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
const Categories = dynamic(() => import("@/components/home/Categories"), {
    ssr: true,
    loading: () => <div className="h-[400px] bg-gray-50 animate-pulse" />
});

const Stats = dynamic(() => import("@/components/home/Stats"), {
    ssr: true,
    loading: () => <div className="h-[200px] bg-gray-50 animate-pulse" />
});

const FeaturedProducts = dynamic(() => import("@/components/home/FeaturedProducts"), {
    ssr: true,
    loading: () => <div className="h-[600px] bg-gray-50 animate-pulse" />
});

const BrandStory = dynamic(() => import("@/components/home/BrandStory"), {
    ssr: true,
    loading: () => <div className="h-[400px] bg-gray-50 animate-pulse" />
});

const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
    ssr: true,
    loading: () => <div className="h-[300px] bg-gray-50 animate-pulse" />
});

const Footer = dynamic(() => import("@/components/home/Footer"), {
    ssr: true
});

export default function Home() {
    return (
        <>
            <Hero />
            <Categories />
            <Stats />
            <FeaturedProducts />
            <BrandStory />
            <Testimonials />
            <Footer />
        </>
    );
}