import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SubjectCategories from "@/components/SubjectCategories";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <SubjectCategories />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
