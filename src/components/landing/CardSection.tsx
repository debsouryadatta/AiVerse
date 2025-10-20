import { cn } from "@/lib/utils";
import { IconBrain, IconCrown, IconFileDownload, IconFileExport, IconMessageCircle, IconSearch, IconShoppingCart, IconUsers } from "@tabler/icons-react";

export function CardSection() {
  const features = [
    {
      title: "AI-Powered Course Generation",
      description: "Create comprehensive courses using advanced AI technologies including LangChain and Groq API, enriched with YouTube content and Unsplash images.",
      icon: <IconBrain />,
    },
    {
      title: "Course Management",
      description: "Easily save and organize your generated courses for future access and editing.",
      icon: <IconFileDownload />,
    },
    {
      title: "PDF Export",
      description: "Export your courses into professional PDF format, perfect for offline study or distribution.",
      icon: <IconFileExport />,
    },
    {
      title: "Social Learning Community",
      description: "Engage with a vibrant community of learners. Share, like, and comment on courses, and connect with course creators.",
      icon: <IconUsers />,
    },
    {
      title: "Premium Generation",
      description: "Unlock unlimited course generation with our premium plan, powered by secure Stripe payments.",
      icon: <IconCrown />,
    },
    {
      title: "Interactive PDF Chat",
      description: "Engage with your course material like never before with our innovative Chat with PDF feature.",
      icon: <IconMessageCircle />,
    },
    {
      title: "Course Marketplace",
      description: "Access a wide range of free courses or sell your premium content in our vibrant course marketplace.",
      icon: <IconShoppingCart />,
    },
    {
      title: "Advanced Search and Discovery",
      description: "Find the perfect courses and connect with like-minded learners using our powerful search and follow features.",
      icon: <IconSearch />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto bg-black">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l border-neutral-800",
        index < 4 && "lg:border-b border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
