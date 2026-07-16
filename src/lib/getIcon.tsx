import React from "react";
import * as Icons from "lucide-react";

export function getIcon(name: string) {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (IconComponent) {
    return <IconComponent className="w-5 h-5" />;
  }
  return <Icons.HelpCircle className="w-5 h-5" />;
}
