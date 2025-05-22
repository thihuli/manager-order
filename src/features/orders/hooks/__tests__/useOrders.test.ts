
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOrders } from '../useOrders';
import { orderApi } from '../../api/orderApi';
import { OrderStatus, OrderSide } from '../../constants';

// Mock do módulo orderApi
vi.mock('../../api/orderApi', () => ({
  orderApi: {
    getOrders: vi.fn(),
    getOrderById: vi.fn(),
    createOrder: vi.fn(),
    cancelOrder: vi.fn()
  }
}));

describe('useOrders hook', () => {
  // Mock de dados de teste
  const mockOrders = [
    {
      id: 'ORD-001',
      instrument: 'PETR4',
      side: OrderSide.BUY,
      price: 28.45,
      quantity: 100,
      remainingQuantity: 100,
      status: OrderStatus.OPEN,
      timestamp: new Date().toISOString(),
    },
    {
      id: 'ORD-002',
      instrument: 'VALE3',
      side: OrderSide.SELL,
      price: 68.32,
      quantity: 50,
      remainingQuantity: 0,
      status: OrderStatus.EXECUTED,
      timestamp: new Date().toISOString(),
    }
  ];

  const mockOrderDetail = {
    ...mockOrders[0],
    history: [
      {
        timestamp: new Date().toISOString(),
        status: OrderStatus.OPEN,
        description: 'Ordem criada'
      }
    ]
  };

  // Reset dos mocks antes de cada teste
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock das chamadas de API
    vi.mocked(orderApi.getOrders).mockResolvedValue(mockOrders);
    vi.mocked(orderApi.getOrderById).mockResolvedValue(mockOrderDetail);
    vi.mocked(orderApi.createOrder).mockResolvedValue(mockOrders[0]);
    vi.mocked(orderApi.cancelOrder).mockResolvedValue(mockOrders[0]);
  });

  it('should fetch orders on initial render', async () => {
    const { result } = renderHook(() => useOrders());

    // Inicialmente, o loading deve ser true
    expect(result.current.loading).toBe(true);
    
    // Aguardar a resolução da Promise
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verificar se getOrders foi chamado
    expect(orderApi.getOrders).toHaveBeenCalledTimes(1);
    
    // Verificar se os dados foram carregados
    expect(result.current.orders).toHaveLength(2);
    expect(result.current.orders[0].id).toBe('ORD-001');
  });

  it('should handle view order details', async () => {
    const { result } = renderHook(() => useOrders());

    // Aguardar o carregamento inicial
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Chamar a função handleViewDetails
    await act(async () => {
      await result.current.handleViewDetails('ORD-001');
    });

    // Verificar se getOrderById foi chamado com o ID correto
    expect(orderApi.getOrderById).toHaveBeenCalledWith('ORD-001');
    
    // Verificar se os detalhes da ordem foram carregados
    expect(result.current.selectedOrder).toEqual(mockOrderDetail);
    
    // Verificar se o modal foi aberto
    expect(result.current.isDetailsModalOpen).toBe(true);
  });

  it('should handle create order', async () => {
    const { result } = renderHook(() => useOrders());

    const newOrder = {
      instrument: 'BBAS3',
      side: OrderSide.BUY,
      price: 45.67,
      quantity: 200
    };

    // Chamar a função handleCreateOrder
    await act(async () => {
      await result.current.handleCreateOrder(newOrder);
    });

    // Verificar se createOrder foi chamado com os dados corretos
    expect(orderApi.createOrder).toHaveBeenCalledWith(newOrder);
    
    // Verificar se getOrders foi chamado novamente para atualizar a lista
    expect(orderApi.getOrders).toHaveBeenCalledTimes(2);
  });

  it('should handle cancel order flow', async () => {
    const { result } = renderHook(() => useOrders());

    // Iniciar o fluxo de cancelamento
    act(() => {
      result.current.handleCancelOrder('ORD-001');
    });

    // Verificar se o ID da ordem foi armazenado
    expect(result.current.orderToCancel).toBe('ORD-001');
    
    // Verificar se o diálogo de confirmação foi aberto
    expect(result.current.isCancelDialogOpen).toBe(true);

    // Confirmar o cancelamento
    await act(async () => {
      await result.current.confirmCancelOrder();
    });

    // Verificar se cancelOrder foi chamado com o ID correto
    expect(orderApi.cancelOrder).toHaveBeenCalledWith('ORD-001');
    
    // Verificar se getOrders foi chamado novamente para atualizar a lista
    expect(orderApi.getOrders).toHaveBeenCalledTimes(2);
    
    // Verificar se o diálogo foi fechado
    expect(result.current.isCancelDialogOpen).toBe(false);
    expect(result.current.orderToCancel).toBeNull();
  });
});
