import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Blocks",
    title: "AI-Powered Learning",
    description:
      "Experience personalized learning with AI-generated courses, roadmaps, and interactive voice mentors tailored to your needs.",
  },
  {
    icon: "LineChart",
    title: "Community Engagement",
    description:
      "Join a vibrant community of learners, share knowledge through posts, and collaborate on courses with invite codes.",
  },
  {
    icon: "Wallet",
    title: "Flexible Credits System",
    description:
      "Access premium features with our credits system. Generate courses, use AI tools, and enhance your learning experience.",
  },
  {
    icon: "Sparkle",
    title: "Comprehensive Tools",
    description:
      "From AI course generation to voice mentors and roadmaps, get all the tools you need for effective learning in one place.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Benefits</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transform Your Learning Journey
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            AiVerse combines AI-powered learning tools with community features to make learning smarter, more engaging, and accessible for everyone.
          </p>
        </div>

        <div className="relative w-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-[4/3] bg-violet-500/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-[4/3] bg-violet-500/15 rounded-full blur-[128px]" />
          <div className="relative grid lg:grid-cols-2 gap-4 w-full">
            {benefitList.map(({ icon, title, description }, index) => (
              <Card
                key={title}
                className="bg-muted/50 dark:bg-card hover:bg-background transition-all duration-300 group/number hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/10 cursor-pointer border-zinc-200 dark:border-zinc-700"
              >
                <CardHeader>
                  <div className="flex justify-between">
                    <Icon
                      name={icon as keyof typeof icons}
                      size={32}
                      color="hsl(var(--primary))"
                      className="mb-6 text-primary transition-transform duration-300 group-hover/number:scale-110"
                    />
                    <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                      0{index + 1}
                    </span>
                  </div>

                  <CardTitle>{title}</CardTitle>
                </CardHeader>

                <CardContent className="text-muted-foreground">
                  {description}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
