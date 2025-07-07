import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Lightbulb } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-gradient-card"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              UpliftED
              <span className="block text-3xl lg:text-4xl font-normal text-muted-foreground mt-2">
                Knowledge Sharing Platform
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Connect students across all backgrounds to share knowledge through Q&A and collaborative study groups.
            </p>
            
            {/* Simple stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Connect & Learn</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Share Knowledge</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span>Grow Together</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="default" size="lg" className="text-lg px-8 py-4">
                Join UpliftED <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Image - simplified */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-soft border">
              <img 
                src={heroImage} 
                alt="Students collaborating and learning together" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;