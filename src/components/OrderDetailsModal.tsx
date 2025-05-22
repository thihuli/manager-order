
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { OrderDetail } from "@/services/orderApi";
import { StatusBadge } from "@/components/StatusBadge";
import { SideBadge } from "@/components/SideBadge";
import { formatCurrency, formatDateTimeLocal } from "@/lib/formatters";

interface OrderDetailsModalProps {
  order: OrderDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsModal({ order, open, onOpenChange }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            Ordem {order.id} <StatusBadge status={order.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Instrumento</span>
              <p className="font-semibold">{order.instrument}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Lado</span>
              <div><SideBadge side={order.side} /></div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Status</span>
              <div><StatusBadge status={order.status} /></div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Data de Criação</span>
              <p>{formatDateTimeLocal(order.timestamp)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Preço</span>
              <p className="font-semibold font-mono">{formatCurrency(order.price)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Quantidade</span>
              <p className="font-mono">{order.quantity}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Quantidade Restante</span>
              <p className="font-mono">{order.remainingQuantity}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Quantidade Executada</span>
              <p className="font-mono">{order.quantity - order.remainingQuantity}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Histórico</h3>
          <div className="overflow-hidden rounded-md border">
            <div className="bg-muted/50 p-4">
              <div className="relative">
                {order.history.map((entry, index) => (
                  <div key={index} className="mb-6 last:mb-0 flex">
                    <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border bg-background">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary"></span>
                    </div>
                    <div className="ml-10 space-y-1">
                      <p className="text-sm leading-none">
                        <StatusBadge status={entry.status} />
                        <time className="ml-2 text-muted-foreground">
                          {formatDateTimeLocal(entry.timestamp)}
                        </time>
                      </p>
                      <p>{entry.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
