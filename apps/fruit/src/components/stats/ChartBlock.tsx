import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wilhalla/ui/components/card";
import type { ReactNode } from "react";

interface ChartBlockProps {
  title: string;
  description: string;
  children: ReactNode;
}

/** One figure of the statistics page: a title, what it shows, and the chart or table. */
export default function ChartBlock({ title, description, children }: ChartBlockProps) {
  return (
    <Card variant="flat" className="min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-2xl">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
