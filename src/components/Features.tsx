import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  Video, 
  Share2, 
  Trophy,
  Calendar,
  Shield
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Study Groups",
    description: "Join or create study groups for your subjects. Chat in real-time, share notes, and collaborate on assignments."
  },
  {
    icon: Video,
    title: "Virtual Sessions",
    description: "Host and join video study sessions. Screen sharing, whiteboards, and breakout rooms for effective learning."
  },
  {
    icon: Share2,
    title: "Knowledge Sharing",
    description: "Share your notes, create tutorials, and help others understand complex topics through our content platform."
  },
  {
    icon: Trophy,
    title: "Achievement System",
    description: "Earn badges and points for helping others, participating in discussions, and achieving learning milestones."
  },
  {
    icon: Calendar,
    title: "Study Planner",
    description: "Organize your study schedule, set reminders, and coordinate group study sessions with integrated calendars."
  },
  {
    icon: Shield,
    title: "Safe Environment",
    description: "Moderated community with academic integrity guidelines ensuring a respectful and productive learning space."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Powerful <span className="bg-gradient-accent bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to enhance your learning experience and connect with fellow students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;