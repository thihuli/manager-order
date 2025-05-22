
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { orderApi } from "../api/orderApi";
import { Order, OrderDetail, OrderFilters, OrderFormValues } from "../types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<OrderFilters>({});
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  // Load orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await orderApi.getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Erro ao carregar ordens");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Apply filters to orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Check each filter property
      for (const [key, value] of Object.entries(filters)) {
        if (key === "timestamp" || key === "date") {
          // For date, compare only the date part
          const orderDate = new Date(order.timestamp).toISOString().split("T")[0];
          const filterDate = typeof value === 'string' ? value : undefined;
          if (filterDate && orderDate !== filterDate) return false;
        } else if (order[key as keyof Order] !== value) {
          return false;
        }
      }
      return true;
    });
  }, [orders, filters]);

  const handleViewDetails = useCallback(async (orderId: string) => {
    try {
      const order = await orderApi.getOrderById(orderId);
      if (order) {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
        setSelectedOrderId(orderId);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Erro ao carregar detalhes da ordem");
    }
  }, []);

  const handleCancelOrder = useCallback((orderId: string) => {
    setOrderToCancel(orderId);
    setIsCancelDialogOpen(true);
  }, []);

  const confirmCancelOrder = useCallback(async () => {
    if (!orderToCancel) return;
    
    try {
      await orderApi.cancelOrder(orderToCancel);
      toast.success("Ordem cancelada com sucesso");
      fetchOrders(); // Refresh orders
      setIsCancelDialogOpen(false);
      setOrderToCancel(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao cancelar ordem");
    }
  }, [orderToCancel, fetchOrders]);

  const handleCreateOrder = useCallback(async (values: OrderFormValues) => {
    try {
      await orderApi.createOrder(values);
      fetchOrders(); // Refresh orders after creating
      return true;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }, [fetchOrders]);

  return {
    orders: filteredOrders,
    loading,
    filters,
    setFilters,
    selectedOrder,
    selectedOrderId,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isCreateFormOpen,
    setIsCreateFormOpen,
    isCancelDialogOpen,
    setIsCancelDialogOpen,
    handleViewDetails,
    handleCancelOrder,
    confirmCancelOrder,
    orderToCancel,  // Make sure to include this property
    handleCreateOrder,
    refreshOrders: fetchOrders,
  };
}
