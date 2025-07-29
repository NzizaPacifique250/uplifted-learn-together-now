import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-hero p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary">Uplifted</span>
          </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/questions" className="text-foreground hover:text-primary transition-colors font-medium">
              Asked Questions
            </a>
            <a href="/study-groups" className="text-foreground hover:text-primary transition-colors font-medium">
              Study Groups
            </a>
            {/* This will be comming in next version */}
            {/* <a href="/community" className="text-foreground hover:text-primary transition-colors font-medium">
              Community
            </a> */}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <a href="/questions" className="text-foreground hover:text-primary transition-colors font-medium px-4 py-2">
                Asked Questions
              </a>
              <a href="/study-groups" className="text-foreground hover:text-primary transition-colors font-medium px-4 py-2">
                Study Groups
              </a>
              {/* This will be comming in next version */}
              {/* <a href="/community" className="text-foreground hover:text-primary transition-colors font-medium px-4 py-2">
                Community
              </a> */}
              <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">{user?.email}</div>
                <Button variant="ghost" className="justify-start" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;