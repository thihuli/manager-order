
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderTable } from "@/features/orders/components/OrderTable";
import { OrderFilters } from "@/components/OrderFilters";
import { OrderDetailsModal } from "@/features/orders/components/OrderDetailsModal";
import { CreateOrderForm } from "@/features/orders/components/CreateOrderForm";
import { CancelOrderDialog } from "@/features/orders/components/CancelOrderDialog";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { OrderFilters as OrderFiltersType } from "@/features/orders/types";

export default function Orders() {
  const {
    orders,
    loading,
    setFilters,
    selectedOrder,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isCreateFormOpen,
    setIsCreateFormOpen,
    isCancelDialogOpen,
    setIsCancelDialogOpen,
    handleViewDetails,
    handleCancelOrder,
    confirmCancelOrder,
    orderToCancel,
    handleCreateOrder
  } = useOrders();

  // Function to adapt filter format
  const handleApplyFilters = (filters: OrderFiltersType) => {
    setFilters(filters);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciamento de Ordens</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie suas ordens de compra e venda de ativos
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateFormOpen(true)}
          className="mt-4 md:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Ordem
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Ordens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <OrderFilters onApplyFilters={handleApplyFilters} />
          </div>
          {loading ? (
            <div className="py-8 text-center">Carregando ordens...</div>
          ) : (
            <OrderTable
              data={orders}
              onViewDetails={handleViewDetails}
              onCancelOrder={handleCancelOrder}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <OrderDetailsModal
        order={selectedOrder}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
      />

      <CreateOrderForm
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
        onCreateOrder={handleCreateOrder}
      />

      <CancelOrderDialog
        open={isCancelDialogOpen}
        orderId={orderToCancel}
        onConfirm={confirmCancelOrder}
        onCancel={() => setIsCancelDialogOpen(false)}
      />
    </div>
  );
}
