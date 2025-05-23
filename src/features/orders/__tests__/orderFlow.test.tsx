import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Orders from '../../../pages/Orders';
import { orderApi } from '../api/orderApi';
import { toast } from 'sonner';
import { OrderStatus, OrderSide } from '../constants';

vi.mock('../api/orderApi', () => ({
  orderApi: {
    getOrders: vi.fn(),
    getOrderById: vi.fn(),
    createOrder: vi.fn(),
    cancelOrder: vi.fn()
  },
  instruments: ['PETR4', 'VALE3', 'ITUB4']
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));


vi.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a href="#">{children}</a>,
  useNavigate: () => vi.fn(),
}));

describe('Order Flow Integration', () => {
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

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(orderApi.getOrders).mockResolvedValue(mockOrders);
    vi.mocked(orderApi.getOrderById).mockResolvedValue(mockOrderDetail);
    vi.mocked(orderApi.createOrder).mockImplementation(async (data) => {
      return {
        ...data,
        id: 'ORD-NEW',
        remainingQuantity: data.quantity,
        status: OrderStatus.OPEN,
        timestamp: new Date().toISOString(),
      };
    });
    vi.mocked(orderApi.cancelOrder).mockResolvedValue({
      ...mockOrders[0],
      status: OrderStatus.CANCELLED,
      remainingQuantity: mockOrders[0].remainingQuantity,
    });
  });

  it('should display orders and handle order details flow', async () => {
    const user = userEvent.setup();
    render(<Orders />);

    expect(screen.getByText('Gerenciamento de Ordens')).toBeInTheDocument();


    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument();
    });

    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('ORD-002')).toBeInTheDocument();

    const menuButtons = screen.getAllByRole('button', { name: /abrir menu/i });
    await user.click(menuButtons[0]);

    const detailsOption = screen.getByText('Ver detalhes');
    await user.click(detailsOption);

    expect(orderApi.getOrderById).toHaveBeenCalledWith('ORD-001');

    await waitFor(() => {
      expect(screen.getByText(/Ordem ORD-001/)).toBeInTheDocument();
    });

    expect(screen.getByText('Histórico')).toBeInTheDocument();
    expect(screen.getByText('Ordem criada')).toBeInTheDocument();
  });

  it('should handle order cancellation flow', async () => {
    const user = userEvent.setup();
    render(<Orders />);

    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument();
    });

    const menuButtons = screen.getAllByRole('button', { name: /abrir menu/i });
    await user.click(menuButtons[0]);

    const cancelOption = screen.getByText('Cancelar ordem');
    await user.click(cancelOption);

    expect(screen.getByText(/Tem certeza que deseja cancelar a ordem ORD-001/)).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: /cancelar ordem/i });
    await user.click(confirmButton);

    expect(orderApi.cancelOrder).toHaveBeenCalledWith('ORD-001');
    
    expect(orderApi.getOrders).toHaveBeenCalledTimes(2);
    
    expect(toast.success).toHaveBeenCalledWith("Ordem cancelada com sucesso");
  });
});
