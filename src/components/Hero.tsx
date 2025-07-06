import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Lightbulb } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Lift Your
              <span className="bg-gradient-accent bg-clip-text text-transparent"> Learning</span>
            </h1>
            <p className="text-xl lg:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              Connect with fellow students, share knowledge, and uplift each other's learning journey in our collaborative educational community.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Users className="h-5 w-5" />
                <span className="font-semibold">10k+ Students</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <BookOpen className="h-5 w-5" />
                <span className="font-semibold">50+ Subjects</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Lightbulb className="h-5 w-5" />
                <span className="font-semibold">1M+ Insights</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="accent" size="lg" className="text-lg px-8 py-4">
                Start Learning <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="learning" size="lg" className="text-lg px-8 py-4">
                Explore Subjects
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-glow">
              <img 
                src={heroImage} 
                alt="Students collaborating and learning together" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground p-4 rounded-full shadow-glow animate-bounce">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground p-4 rounded-full shadow-glow animate-bounce" style={{animationDelay: '1s'}}>
              <Lightbulb className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;