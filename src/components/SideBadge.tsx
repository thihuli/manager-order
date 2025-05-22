
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SideBadgeProps {
  side: "Compra" | "Venda";
}

export const SideBadge: React.FC<SideBadgeProps> = ({ side }) => {
  const isCompra = side === "Compra";
  
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
