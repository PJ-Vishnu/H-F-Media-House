
"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { type LucideProps } from 'lucide-react';

// Define a type for all possible icon names from lucide-react
type IconName = keyof typeof LucideIcons;

interface DynamicIconProps extends LucideProps {
  name: string;
}

// A default icon to render if the requested icon name is not found
const FallbackIcon = LucideIcons.HelpCircle;

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  if (!name) {
    return <FallbackIcon {...props} />;
  }
  
  // Lucide-react exports icons in PascalCase (e.g., "camera" becomes "Camera")
  // This formatter attempts to match that convention.
  const iconName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('') as IconName;
  
  const IconComponent = LucideIcons[iconName] as React.ComponentType<LucideProps> | undefined;

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in lucide-react. Rendering fallback icon.`);
    return <FallbackIcon {...props} />;
  }

  return <IconComponent {...props} />;
}
