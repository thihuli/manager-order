
import { toast } from "@/components/ui/sonner";

export interface Order {
  id: string;
  instrument: string;
  side: "Compra" | "Venda";
  price: number;
  quantity: number;
  remainingQuantity: number;
  status: "Aberta" | "Parcial" | "Executada" | "Cancelada";
  timestamp: string;
}

export interface OrderHistory {
  timestamp: string;
  status: Order["status"];
  description: string;
}

export interface OrderDetail extends Order {
  history: OrderHistory[];
}

let orders: OrderDetail[] = [
  {
    id: "ORD-001",
    instrument: "PETR4",
    side: "Compra",
    price: 28.45,
    quantity: 100,
    remainingQuantity: 100,
    status: "Aberta",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    history: [
      {
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: "Aberta",
        description: "Ordem criada"
      }
    ]
  },
  {
    id: "ORD-002",
    instrument: "VALE3",
    side: "Venda",
    price: 68.32,
    quantity: 50,
    remainingQuantity: 0,
    status: "Executada",
    timestamp: new Date(Date.now() - 6500000).toISOString(),
    history: [
      {
        timestamp: new Date(Date.now() - 6500000).toISOString(),
        status: "Aberta",
        description: "Ordem criada"
      },
      {
        timestamp: new Date(Date.now() - 5900000).toISOString(),
        status: "Executada",
        description: "Ordem executada completamente"
      }
    ]
  },
  {
    id: "ORD-003",
    instrument: "ITUB4",
    side: "Compra",
    price: 32.10,
    quantity: 200,
    remainingQuantity: 80,
    status: "Parcial",
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    history: [
      {
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        status: "Aberta",
        description: "Ordem criada"
      },
      {
        timestamp: new Date(Date.now() - 4800000).toISOString(),
        status: "Parcial",
        description: "Ordem parcialmente executada (120 unidades)"
      }
    ]
  },
  {
    id: "ORD-004",
    instrument: "BBDC4",
    side: "Venda",
    price: 21.75,
    quantity: 150,
    remainingQuantity: 0,
    status: "Cancelada",
    timestamp: new Date(Date.now() - 4200000).toISOString(),
    history: [
      {
        timestamp: new Date(Date.now() - 4200000).toISOString(),
        status: "Aberta",
        description: "Ordem criada"
      },
      {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: "Cancelada",
        description: "Ordem cancelada pelo usuário"
      }
    ]
  },
  {
    id: "ORD-005",
    instrument: "MGLU3",
    side: "Compra",
    price: 4.75,
    quantity: 500,
    remainingQuantity: 500,
    status: "Aberta",
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    history: [
      {
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        status: "Aberta",
        description: "Ordem criada"
      }
    ]
  }
];

export const instruments = [
  "PETR4", "VALE3", "ITUB4", "BBDC4", "MGLU3", "ABEV3", "WEGE3", 
  "B3SA3", "RENT3", "BRKM5", "EMBR3", "BBAS3", "GGBR4", "LREN3"
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  
  createOrder: async (newOrder: Omit<Order, 'id' | 'timestamp' | 'status' | 'remainingQuantity'>): Promise<Order> => {
    await delay(700);
    
    const timestamp = new Date().toISOString();
    const newId = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
    
    const order: OrderDetail = {
      ...newOrder,
      id: newId,
      timestamp: timestamp,
      status: 'Aberta',
      remainingQuantity: newOrder.quantity,
      history: [
        {
          timestamp: timestamp,
          status: 'Aberta',
          description: 'Ordem criada'
        }
      ]
    };
    
    orders.push(order);
    
    tryExecuteOrder(order);
    
    return { ...order };
  },
  
  cancelOrder: async (id: string): Promise<Order | undefined> => {
    await delay(400);
    
    const orderIndex = orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return undefined;
    
    const order = orders[orderIndex];
    
    if (order.status !== 'Aberta' && order.status !== 'Parcial') {
      throw new Error('Apenas ordens com status "Aberta" ou "Parcial" podem ser canceladas');
    }
    
    const timestamp = new Date().toISOString();
    
    const updatedOrder: OrderDetail = {
      ...order,
      status: 'Cancelada',
      history: [
        ...order.history,
        {
          timestamp: timestamp,
          status: 'Cancelada',
          description: 'Ordem cancelada pelo usuário'
        }
      ]
    };
    
    orders[orderIndex] = updatedOrder;
    return { ...updatedOrder };
  }
};

function tryExecuteOrder(newOrder: OrderDetail) {
  const matchingOrders = orders.filter(order => 
    order.id !== newOrder.id && 
    order.instrument === newOrder.instrument && 
    order.side !== newOrder.side && 
    (order.status === 'Aberta' || order.status === 'Parcial') &&
    ((newOrder.side === 'Compra' && order.price <= newOrder.price) || 
     (newOrder.side === 'Venda' && order.price >= newOrder.price))
  );
  
  if (matchingOrders.length === 0) return;
  
  matchingOrders.sort((a, b) => {
    if (newOrder.side === 'Compra') {
      return a.price !== b.price ? a.price - b.price : 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else {
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
      remainingQty -= matchRemainingQty;
      
      orders[orderIndex] = {
        ...matchingOrder,
        remainingQuantity: 0,
        status: 'Executada',
        history: [
          ...matchingOrder.history,
          {
            timestamp: timestamp,
            status: 'Executada',
            description: 'Ordem executada completamente'
          }
        ]
      };
    } else {
      orders[orderIndex] = {
        ...matchingOrder,
        remainingQuantity: matchingOrder.remainingQuantity - remainingQty,
        status: 'Parcial',
        history: [
          ...matchingOrder.history,
          {
            timestamp: timestamp,
            status: 'Parcial',
            description: `Ordem parcialmente executada (${remainingQty} unidades)`
          }
        ]
      };
      
      remainingQty = 0;
    }
  }
  
  const newOrderIndex = orders.findIndex(o => o.id === newOrder.id);
  
  if (remainingQty === 0) {
    orders[newOrderIndex] = {
      ...newOrder,
      remainingQuantity: 0,
      status: 'Executada',
      history: [
        ...newOrder.history,
        {
          timestamp: new Date().toISOString(),
          status: 'Executada',
          description: 'Ordem executada completamente'
        }
      ]
    };
  } else if (remainingQty < newOrder.quantity) {
    orders[newOrderIndex] = {
      ...newOrder,
      remainingQuantity: remainingQty,
      status: 'Parcial',
      history: [
        ...newOrder.history,
        {
          timestamp: new Date().toISOString(),
          status: 'Parcial',
          description: `Ordem parcialmente executada (${newOrder.quantity - remainingQty} unidades)`
        }
      ]
    };
  }

  toast.success("Ordens executadas com sucesso!");
}
