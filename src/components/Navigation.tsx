import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-hero p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary">Uplifted</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#subjects" className="text-foreground hover:text-primary transition-colors font-medium">
              Subjects
            </a>
            <a href="#study-groups" className="text-foreground hover:text-primary transition-colors font-medium">
              Study Groups
            </a>
            <a href="#community" className="text-foreground hover:text-primary transition-colors font-medium">
              Community
            </a>
            <a href="#resources" className="text-foreground hover:text-primary transition-colors font-medium">
              Resources
            </a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost">Sign In</Button>
            <Button variant="hero">Join Now</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col gap-4">
              <a href="#subjects" className="text-foreground hover:text-primary transition-colors font-medium px-4 py-2">
                Subjects
              </a>
              <a href="#study-groups" className="text-foreground hover:text-primary transition-colors font-medium px-4 py-2">
                Study Groups
              </a>
              <a href="#community" className="text-foreground hover:text-primary transition-colors font-medium px-4 py-2">
                Community
              </a>
              <a href="#resources" className="text-foreground hover:text-primary transition-colors font-medium px-4 py-2">
                Resources
              </a>
              <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border">
                <Button variant="ghost" className="justify-start">Sign In</Button>
                <Button variant="hero" className="justify-start">Join Now</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;