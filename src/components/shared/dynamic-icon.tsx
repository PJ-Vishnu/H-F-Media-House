
"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { type LucideProps } from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface DynamicIconProps extends LucideProps {
  name: string;
}

// A default icon to render if the requested icon name is not found
const FallbackIcon = LucideIcons.HelpCircle;

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  // Capitalize the first letter of the name to match lucide-react export convention (e.g., "camera" -> "Camera")
  const iconName = (name.charAt(0).toUpperCase() + name.slice(1)) as IconName;
  
  const IconComponent = LucideIcons[iconName] as React.ComponentType<LucideProps> | undefined;

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in lucide-react. Rendering fallback.`);
    return <FallbackIcon {...props} />;
  }

  return <IconComponent {...props} />;
}
