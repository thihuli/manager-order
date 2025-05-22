
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OrderStatus, STATUS_CONFIG } from "../constants";

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant="outline" className={cn("font-medium", config.color)}>
      {config.text}
    </Badge>
  );
};
