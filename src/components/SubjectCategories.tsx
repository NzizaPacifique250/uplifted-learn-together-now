import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calculator, 
  Atom, 
  Globe, 
  BookOpen, 
  Palette, 
  Code, 
  Heart, 
  Music,
  Users,
  ArrowRight
} from "lucide-react";

const subjects = [
  {
    icon: Calculator,
    title: "Mathematics",
    description: "From algebra to calculus, join study groups and share problem-solving techniques.",
    members: "2.3k",
    color: "bg-blue-500"
  },
  {
    icon: Atom,
    title: "Science",
    description: "Physics, Chemistry, Biology - explore the wonders of scientific discovery.",
    members: "1.8k",
    color: "bg-green-500"
  },
  {
    icon: Globe,
    title: "Social Studies",
    description: "History, Geography, Economics - understand our world and society.",
    members: "1.5k",
    color: "bg-orange-500"
  },
  {
    icon: BookOpen,
    title: "Literature",
    description: "Analyze texts, share interpretations, and improve writing skills together.",
    members: "1.2k",
    color: "bg-purple-500"
  },
  {
    icon: Code,
    title: "Computer Science",
    description: "Programming, algorithms, and technology - build the future together.",
    members: "2.1k",
    color: "bg-indigo-500"
  },
  {
    icon: Palette,
    title: "Arts",
    description: "Visual arts, design, and creative expression - inspire and be inspired.",
    members: "900",
    color: "bg-pink-500"
  },
  {
    icon: Heart,
    title: "Health Sciences",
    description: "Medicine, nursing, psychology - learn to help and heal others.",
    members: "1.4k",
    color: "bg-red-500"
  },
  {
    icon: Music,
    title: "Music",
    description: "Theory, performance, composition - share your passion for music.",
    members: "800",
    color: "bg-yellow-500"
  }
];

const SubjectCategories = () => {
  return (
    <section id="subjects" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Explore <span className="bg-gradient-hero bg-clip-text text-transparent">Subjects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join study groups, share knowledge, and learn from peers across various academic disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {subjects.map((subject, index) => (
            <Card key={index} className="group hover:shadow-glow transition-all duration-300 border-border hover:border-primary/50 cursor-pointer">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <subject.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                  {subject.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                  {subject.description}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{subject.members} members</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="learning" size="lg" className="text-lg px-8 py-4">
            View All Subjects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SubjectCategories;