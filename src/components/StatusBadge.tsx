
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Order } from "@/services/orderApi";

interface StatusBadgeProps {
  status: Order["status"];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    Aberta: { color: "bg-blue-100 text-blue-800 hover:bg-blue-100", text: "Aberta" },
    Parcial: { color: "bg-amber-100 text-amber-800 hover:bg-amber-100", text: "Parcial" },
    Executada: { color: "bg-green-100 text-green-800 hover:bg-green-100", text: "Executada" },
    Cancelada: { color: "bg-red-100 text-red-800 hover:bg-red-100", text: "Cancelada" }
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("font-medium", config.color)}>
      {config.text}
    </Badge>
  );
};
