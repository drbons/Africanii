import * as React from "react";
import { cn } from "@/lib/utils";

interface ToasterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Toaster = React.forwardRef<HTMLDivElement, ToasterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "fixed bottom-4 right-4 z-50 flex flex-col gap-2",
          className
        )}
        {...props}
      />
    );
  }
);
Toaster.displayName = "Toaster";

export { Toaster };