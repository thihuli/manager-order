
import { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown,
  Filter, 
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { SideBadge } from "@/components/SideBadge";
import { Order } from "@/services/orderApi";
import { formatCurrency, formatDateTimeLocal } from "@/lib/formatters";

interface OrderTableProps {
  data: Order[];
  onViewDetails: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
}

type SortField = keyof Pick<Order, "id" | "instrument" | "price" | "quantity" | "timestamp">;

export function OrderTable({ data, onViewDetails, onCancelOrder }: OrderTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;

    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc" 
        ? fieldA.localeCompare(fieldB) 
        : fieldB.localeCompare(fieldA);
    }

    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortDirection === "asc" 
        ? fieldA - fieldB 
        : fieldB - fieldA;
    }

    // Handle dates
    if (sortField === "timestamp") {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortDirection === "asc" 
        ? dateA - dateB 
        : dateB - dateA;
    }

    return 0;
  });

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" 
      ? <ArrowUp className="ml-2 h-4 w-4" /> 
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const canCancel = (status: Order["status"]) => {
    return status === "Aberta" || status === "Parcial";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("id")}
            >
              <div className="flex items-center">
                ID {sortIcon("id")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("instrument")}
            >
              <div className="flex items-center">
                Instrumento {sortIcon("instrument")}
              </div>
            </TableHead>
            <TableHead>Lado</TableHead>
            <TableHead 
              className="cursor-pointer text-right"
              onClick={() => handleSort("price")}
            >
              <div className="flex items-center justify-end">
                Preço {sortIcon("price")}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer text-right"
              onClick={() => handleSort("quantity")}
            >
              <div className="flex items-center justify-end">
                Quantidade {sortIcon("quantity")}
              </div>
            </TableHead>
            <TableHead className="text-right">Qtde. Restante</TableHead>
            <TableHead>Status</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("timestamp")}
            >
              <div className="flex items-center">
                Data/Hora {sortIcon("timestamp")}
              </div>
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                Nenhuma ordem encontrada.
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.instrument}</TableCell>
                <TableCell><SideBadge side={order.side} /></TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(order.price)}
                </TableCell>
                <TableCell className="text-right font-mono">{order.quantity}</TableCell>
                <TableCell className="text-right font-mono">{order.remainingQuantity}</TableCell>
                <TableCell><StatusBadge status={order.status} /></TableCell>
                <TableCell>{formatDateTimeLocal(order.timestamp)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => onViewDetails(order.id)}
                      >
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        disabled={!canCancel(order.status)}
                        className={!canCancel(order.status) ? "text-muted-foreground" : ""}
                        onClick={() => canCancel(order.status) && onCancelOrder(order.id)}
                      >
                        Cancelar ordem
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
