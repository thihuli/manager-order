
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CancelOrderDialogProps {
  open: boolean;
  orderId: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CancelOrderDialog({ 
  open, 
  orderId, 
  onConfirm, 
  onCancel 
}: CancelOrderDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar Ordem</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja cancelar a ordem {orderId}?
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Cancelar Ordem</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
