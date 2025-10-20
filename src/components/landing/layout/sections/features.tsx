import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "BookOpen",
    title: "AI Course Generation",
    description:
      "Create comprehensive courses with AI-powered content, MCQs, YouTube integration, and Unsplash imagery.",
  },
  {
    icon: "Map",
    title: "Learning Roadmaps",
    description:
      "Generate visual learning roadmaps, save them for future reference, and export them to track your progress.",
  },
  {
    icon: "Mic",
    title: "Voice Mentors",
    description:
      "Talk to personalized AI voice mentors with customizable behavior for interactive learning experiences.",
  },
  {
    icon: "Share2",
    title: "Community Features",
    description:
      "Share courses with invite codes, explore user-generated content, and engage through likes and comments.",
  },
  {
    icon: "FileText",
    title: "Content Export",
    description:
      "Export courses as PDFs, save roadmaps, and maintain easy access to your learning materials.",
  },
  {
    icon: "Sparkles",
    title: "Coming Soon",
    description:
      "Chat with website content, interact with PDFs, and experience new AI agents for enhanced learning.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Features
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Powerful Learning Tools
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Discover our comprehensive suite of AI-powered features designed to revolutionize your learning experience.
      </h3>

      <div className="relative w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-[2/1] bg-violet-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-[2/1] bg-violet-500/10 rounded-full blur-[96px]" />
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureList.map(({ icon, title, description }) => (
            <div key={title}>
              <Card className="h-full bg-background border-0 shadow-none group hover:bg-muted/50 dark:hover:bg-card transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <CardHeader className="flex justify-center items-center">
                  <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4 transition-all duration-300 group-hover:bg-primary/30 group-hover:ring-primary/20">
                    <Icon
                      name={icon as keyof typeof icons}
                      size={24}
                      color="hsl(var(--primary))"
                      className="text-primary transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  <CardTitle>{title}</CardTitle>
                </CardHeader>

                <CardContent className="text-muted-foreground text-center">
                  {description}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
