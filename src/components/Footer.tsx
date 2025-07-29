import { GraduationCap, Twitter, Github, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-accent p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-accent-foreground" />
              </div>
              <span className="text-2xl font-bold">Uplifted</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed max-w-md">
              Empowering students to learn together, share knowledge, and uplift each other's educational journey through collaborative learning.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://x.com/AimeNziza" target="_blank" className="bg-primary-foreground/10 p-2 rounded-lg hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com/" target="_blank" className="bg-primary-foreground/10 p-2 rounded-lg hover:bg-primary-foreground/20 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:paccynziza@gmail.com" className="bg-primary-foreground/10 p-2 rounded-lg hover:bg-primary-foreground/20 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#subjects" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Browse Subjects</a></li>
              <li><a href="#study-groups" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Study Groups</a></li>
             {/* This will come in next version */}
              {/* <li><a href="#community" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Community</a></li> */}
              <li><a href="#resources" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Resources</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Guidelines</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2025 Uplifted. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm flex items-center gap-1 mt-4 md:mt-0">
            Made by <a href="https://www.linkedin.com/in/nziza-aime-pacifique/" target="_blank" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors">Nziza</a> with <Heart className="h-4 w-4 text-red-400" /> for learners everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;