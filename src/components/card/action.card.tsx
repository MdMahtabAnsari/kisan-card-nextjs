import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface GenericActionCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function ActionCard({
  title,
  description,
  icon,
  onClick,
}: GenericActionCardProps) {
  return (
    <Card
      onClick={onClick}
            className="w-full cursor-pointer"
    >
      <CardContent className="flex flex-col items-center justify-center text-center">
        <div className="rounded-xl border p-3 text-primary">
          {icon || <CreditCard className="h-8 w-8" />}
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>

          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}