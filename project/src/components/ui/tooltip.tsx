import * as React from "react";
import { cn } from "@/lib/utils";

const Tooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }
>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative inline-block" ref={ref} {...props}>
      {React.Children.map(children, (child, index) => {
        if (index === 0) return child;
        return (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
            <div className={cn("px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap", className)}>
              {child}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

Tooltip.displayName = "Tooltip";

export { Tooltip }; 