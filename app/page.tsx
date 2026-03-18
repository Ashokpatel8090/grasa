
import ConsultationSection from "@/components/ConsultationSection";
import GrasaJourney from "@/components/GrasaJourney";
import GutConcernsSection from "@/components/GutConcernsSection";
import HeroSection from "@/components/HeroSection";
import HolisticPlan from "@/components/HolisticPlan";
import LongevityCheck from "@/components/LongevityCheck";
import NutritionCoach from "@/components/NutritionCoach";
import ProductsGrid from "@/components/ProductsGrid";
import RegimenPlans from "@/components/RegimenPlans";
import RegimenSection from "@/components/RegimenSection";
import ScienceSection from "@/components/ScienceSection";
import Testimonials from "@/components/testimonials";


export default function Home() {
  return (
    <>
      <HeroSection />
      {/* <NutritionCoach/> */}
      <ScienceSection />
      <LongevityCheck/>

      <ProductsGrid />
      
      {/* <HolisticPlan/> */}
      {/* <GrasaJourney/> */}
      {/* <GutConcernsSection/> */}
      <RegimenSection/>
      <RegimenPlans />
      <Testimonials />
      <ConsultationSection/>
    </>
  );
}
