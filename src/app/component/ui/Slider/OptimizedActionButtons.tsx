import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OptimizedActionButtonsProps {
  itemLink: string;
  title?: string;
}

const OptimizedActionButtons: React.FC<OptimizedActionButtonsProps> = ({
  itemLink,
  title = "this content",
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
    }}
    className="hidden sm:flex flex-wrap gap-6 mt-6 sm:mt-8 md:mt-10 relative z-[250]"
  >
    <ActionButton
      href={`${itemLink}?success=true`}
      className="bg-cyan-700 hover:bg-cyan-600 text-white relative z-[250]"
      icon={<Play className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />}
      text="Watch Trailer"
      ariaLabel={`Watch trailer for ${title}`}
      title={title}
    />
    <ActionButton
      href={itemLink}
      className="bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-800 border border-gray-300 relative z-[250]"
      icon={<Info className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />}
      text="More Info"
      ariaLabel={`View more information about ${title}`}
      title={title}
    />
  </motion.div>
);

interface ActionButtonProps {
  href: string;
  className: string;
  icon: React.ReactNode;
  text: string;
  ariaLabel: string;
  title: string;
}

const ActionButton: React.FC<ActionButtonProps> = React.memo(
  ({ href, className, icon, text, ariaLabel, title }) => (
    <Link
      href={href}
      prefetch={false}
      className="flex items-center relative z-[250]"
      aria-label={ariaLabel}
      title={`${text} - ${title}`}
    >
      <Button
        size="lg"
        className={`rounded-full px-6 py-3 md:px-8 md:py-4 text-base md:text-lg transition-all duration-300 hover:scale-105 ${className}`}
      >
        {icon} <span className="sr-only">{title} - </span>
        {text}
      </Button>
    </Link>
  )
);
ActionButton.displayName = "ActionButton";

export default React.memo(OptimizedActionButtons);
