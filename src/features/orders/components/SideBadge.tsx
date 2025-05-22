
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OrderSide } from "../constants";

interface SideBadgeProps {
  side: OrderSide;
}

export const SideBadge: React.FC<SideBadgeProps> = ({ side }) => {
  const isCompra = side === OrderSide.BUY;
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium",
        isCompra 
          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" 
          : "bg-rose-100 text-rose-800 hover:bg-rose-100"
      )}
    >
      {side}
    </Badge>
  );
};
