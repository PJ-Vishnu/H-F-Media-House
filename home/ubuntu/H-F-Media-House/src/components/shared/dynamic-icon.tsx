
"use client";

import { icons, LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) {
    // Return a default icon or null if the name is invalid
    return <icons.HelpCircle {...props} />;
  }

  return <LucideIcon {...props} />;
};
