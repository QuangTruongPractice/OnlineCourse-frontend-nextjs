
import { FeaturedCourses } from "../components/featured-courses";
import { Footer } from "../components/footer";

import { Header } from "../components/header";
import { HeroSection } from "../components/hero-section";



export default function HomePage() {
  return (
    <div className="min-h-screen">

      <main>
        <HeroSection />
        <FeaturedCourses />

      </main>

    </div>
  )
}
