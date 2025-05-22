
import { toast } from "sonner";
import { OrderDetail, Order, OrderFormValues } from "../types";
import { OrderStatus, OrderSide, INSTRUMENTS } from "../constants";

// Initial mock data
let orders: OrderDetail[] = [
  {
    id: "ORD-001",
    instrument: "PETR4",
    side: OrderSide.BUY,
    price: 28.45,
    quantity: 100,
    remainingQuantity: 100,
    status: OrderStatus.OPEN,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    history: [
      {
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: OrderStatus.OPEN,
        description: "Ordem criada"
      }
    ]
  },
  {
    id: "ORD-002",
    instrument: "VALE3",
    side: OrderSide.SELL,
    price: 68.32,
    quantity: 50,
    remainingQuantity: 0,
    status: OrderStatus.EXECUTED,
    timestamp: new Date(Date.now() - 6500000).toISOString(),
    history: [
      {
        timestamp: new Date(Date.now() - 6500000).toISOString(),
        status: OrderStatus.OPEN,
        description: "Ordem criada"
      },
      {
        timestamp: new Date(Date.now() - 5900000).toISOString(),
        status: OrderStatus.EXECUTED,
        description: "Ordem executada completamente"
      }
    ]
  },
  {
    id: "ORD-003",
    instrument: "ITUB4",
    side: OrderSide.BUY,
    price: 32.10,
    quantity: 200,
    remainingQuantity: 80,
    status: OrderStatus.PARTIAL,
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    history: [
      {
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        status: OrderStatus.OPEN,
        description: "Ordem criada"
      },
      {
        timestamp: new Date(Date.now() - 4800000).toISOString(),
        status: OrderStatus.PARTIAL,
        description: "Ordem parcialmente executada (120 unidades)"
      }
    ]
  },
  {
    id: "ORD-004",
    instrument: "BBDC4",
    side: OrderSide.SELL,
    price: 21.75,
    quantity: 150,
    remainingQuantity: 0,
    status: OrderStatus.CANCELLED,
    timestamp: new Date(Date.now() - 4200000).toISOString(),
    history: [
      {
        timestamp: new Date(Date.now() - 4200000).toISOString(),
        status: OrderStatus.OPEN,
        description: "Ordem criada"
      },
      {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: OrderStatus.CANCELLED,
        description: "Ordem cancelada pelo usuário"
      }
    ]
  },
  {
    id: "ORD-005",
    instrument: "MGLU3",
    side: OrderSide.BUY,
    price: 4.75,
    quantity: 500,
    remainingQuantity: 500,
    status: OrderStatus.OPEN,
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    history: [
      {
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        status: OrderStatus.OPEN,
        description: "Ordem criada"
      }
    ]
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API methods
export const orderApi = {
  getOrders: async (): Promise<Order[]> => {
    await delay(500);
    return orders.map(order => ({ ...order }));
  },
  
  getOrderById: async (id: string): Promise<OrderDetail | undefined> => {
    await delay(300);
    const order = orders.find(order => order.id === id);
    return order ? { ...order } : undefined;
  },
  
  createOrder: async (newOrder: OrderFormValues): Promise<Order> => {
    await delay(700);
    
    const timestamp = new Date().toISOString();
    const newId = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
    
    const order: OrderDetail = {
      ...newOrder,
      id: newId,
      timestamp: timestamp,
      status: OrderStatus.OPEN,
      remainingQuantity: newOrder.quantity,
      history: [
        {
          timestamp: timestamp,
          status: OrderStatus.OPEN,
          description: 'Ordem criada'
        }
      ]
    };
    
    orders.push(order);
    
    // Check for matching orders
    tryExecuteOrder(order);
    
    return { ...order };
  },
  
  cancelOrder: async (id: string): Promise<Order | undefined> => {
    await delay(400);
    
    const orderIndex = orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return undefined;
    
    const order = orders[orderIndex];
    
    // Validate if the order can be cancelled
    if (order.status !== OrderStatus.OPEN && order.status !== OrderStatus.PARTIAL) {
      throw new Error(`Apenas ordens com status "${OrderStatus.OPEN}" ou "${OrderStatus.PARTIAL}" podem ser canceladas`);
    }
    
    const timestamp = new Date().toISOString();
    
    // Update the order
    const updatedOrder: OrderDetail = {
      ...order,
      status: OrderStatus.CANCELLED,
      history: [
        ...order.history,
        {
          timestamp: timestamp,
          status: OrderStatus.CANCELLED,
          description: 'Ordem cancelada pelo usuário'
        }
      ]
    };
    
    orders[orderIndex] = updatedOrder;
    return { ...updatedOrder };
  }
};

// Logic to try to execute orders
function tryExecuteOrder(newOrder: OrderDetail) {
  // Filter for potential matching orders
  const matchingOrders = orders.filter(order => 
    order.id !== newOrder.id && 
    order.instrument === newOrder.instrument && 
    order.side !== newOrder.side && 
    (order.status === OrderStatus.OPEN || order.status === OrderStatus.PARTIAL) &&
    ((newOrder.side === OrderSide.BUY && order.price <= newOrder.price) || 
     (newOrder.side === OrderSide.SELL && order.price >= newOrder.price))
  );
  
  if (matchingOrders.length === 0) return;
  
  // Sort by price (best price first) and time (oldest first)
  matchingOrders.sort((a, b) => {
    if (newOrder.side === OrderSide.BUY) {
      // For buy orders: sort sell orders by lowest price first
      return a.price !== b.price ? a.price - b.price : 
             new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else {
      // For sell orders: sort buy orders by highest price first
      return a.price !== b.price ? b.price - a.price : 
             new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
  });
  
  let remainingQty = newOrder.remainingQuantity;
  
  for (const matchingOrder of matchingOrders) {
    if (remainingQty <= 0) break;
    
    const orderIndex = orders.findIndex(o => o.id === matchingOrder.id);
    const matchRemainingQty = matchingOrder.remainingQuantity;
    
    const timestamp = new Date().toISOString();
    
    if (remainingQty >= matchRemainingQty) {
      // The matching order is fully executed
      remainingQty -= matchRemainingQty;
      
      // Update the matching order
      orders[orderIndex] = {
        ...matchingOrder,
        remainingQuantity: 0,
        status: OrderStatus.EXECUTED,
        history: [
          ...matchingOrder.history,
          {
            timestamp: timestamp,
            status: OrderStatus.EXECUTED,
            description: 'Ordem executada completamente'
          }
        ]
      };
    } else {
      // The matching order is partially executed
      // Update the matching order
      orders[orderIndex] = {
        ...matchingOrder,
        remainingQuantity: matchingOrder.remainingQuantity - remainingQty,
        status: OrderStatus.PARTIAL,
        history: [
          ...matchingOrder.history,
          {
            timestamp: timestamp,
            status: OrderStatus.PARTIAL,
            description: `Ordem parcialmente executada (${remainingQty} unidades)`
          }
        ]
      };
      
      remainingQty = 0;
    }
  }
  
  // Update the original order status
  const newOrderIndex = orders.findIndex(o => o.id === newOrder.id);
  
  if (remainingQty === 0) {
    // The new order is fully executed
    orders[newOrderIndex] = {
      ...newOrder,
      remainingQuantity: 0,
      status: OrderStatus.EXECUTED,
      history: [
        ...newOrder.history,
        {
          timestamp: new Date().toISOString(),
          status: OrderStatus.EXECUTED,
          description: 'Ordem executada completamente'
        }
      ]
    };
  } else if (remainingQty < newOrder.quantity) {
    // The new order is partially executed
    orders[newOrderIndex] = {
      ...newOrder,
      remainingQuantity: remainingQty,
      status: OrderStatus.PARTIAL,
      history: [
        ...newOrder.history,
        {
          timestamp: new Date().toISOString(),
          status: OrderStatus.PARTIAL,
          description: `Ordem parcialmente executada (${newOrder.quantity - remainingQty} unidades)`
        }
      ]
    };
  }
  
  // Notify about execution
  toast.success("Ordens executadas com sucesso!");
}

export { INSTRUMENTS };
