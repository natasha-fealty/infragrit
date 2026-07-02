import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fadeInUp } from "./motion";

interface Props {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  icon?: ReactNode;
}

export function ChartCard({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
  icon,
}: Props) {
  return (
    <motion.div variants={fadeInUp} className={cn("h-full", className)}>
      <Card className="flex h-full flex-col overflow-hidden">
        <CardHeader className="flex-row items-start justify-between space-y-0 gap-2">
          <div className="flex items-start gap-2.5">
            {icon && (
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              <CardTitle>{title}</CardTitle>
              {description && (
                <CardDescription className="mt-1">{description}</CardDescription>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-1.5">{actions}</div>}
        </CardHeader>
        <CardContent className={cn("flex-1", bodyClassName)}>{children}</CardContent>
      </Card>
    </motion.div>
  );
}
