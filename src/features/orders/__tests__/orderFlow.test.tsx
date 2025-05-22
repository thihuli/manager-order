import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Orders from '../../../pages/Orders';
import { orderApi } from '../api/orderApi';
import { toast } from 'sonner';
import { OrderStatus, OrderSide } from '../constants';

// Mock do módulo orderApi
vi.mock('../api/orderApi', () => ({
  orderApi: {
    getOrders: vi.fn(),
    getOrderById: vi.fn(),
    createOrder: vi.fn(),
    cancelOrder: vi.fn()
  },
  instruments: ['PETR4', 'VALE3', 'ITUB4']
}));

// Mock do módulo sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

// Mock do React Router
vi.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a href="#">{children}</a>,
  useNavigate: () => vi.fn(),
}));

describe('Order Flow Integration', () => {
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

    // Verificar se o título está presente
    expect(screen.getByText('Gerenciamento de Ordens')).toBeInTheDocument();

    // Aguardar o carregamento inicial das ordens
    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument();
    });

    // Verificar se as duas ordens foram renderizadas
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('ORD-002')).toBeInTheDocument();

    // Clicar no menu de uma ordem
    const menuButtons = screen.getAllByRole('button', { name: /abrir menu/i });
    await user.click(menuButtons[0]);

    // Clicar na opção "Ver detalhes"
    const detailsOption = screen.getByText('Ver detalhes');
    await user.click(detailsOption);

    // Verificar se getOrderById foi chamado com o ID correto
    expect(orderApi.getOrderById).toHaveBeenCalledWith('ORD-001');

    // Verificar se o modal de detalhes foi aberto
    await waitFor(() => {
      expect(screen.getByText(/Ordem ORD-001/)).toBeInTheDocument();
    });

    // Verificar se os detalhes estão presentes
    expect(screen.getByText('Histórico')).toBeInTheDocument();
    expect(screen.getByText('Ordem criada')).toBeInTheDocument();
  });

  it('should handle order cancellation flow', async () => {
    const user = userEvent.setup();
    render(<Orders />);

    // Aguardar o carregamento inicial das ordens
    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument();
    });

    // Clicar no menu de uma ordem
    const menuButtons = screen.getAllByRole('button', { name: /abrir menu/i });
    await user.click(menuButtons[0]);

    // Clicar na opção "Cancelar ordem"
    const cancelOption = screen.getByText('Cancelar ordem');
    await user.click(cancelOption);

    // Verificar se o diálogo de confirmação foi aberto
    expect(screen.getByText(/Tem certeza que deseja cancelar a ordem ORD-001/)).toBeInTheDocument();

    // Confirmar o cancelamento
    const confirmButton = screen.getByRole('button', { name: /cancelar ordem/i });
    await user.click(confirmButton);

    // Verificar se cancelOrder foi chamado com o ID correto
    expect(orderApi.cancelOrder).toHaveBeenCalledWith('ORD-001');
    
    // Verificar se getOrders foi chamado novamente
    expect(orderApi.getOrders).toHaveBeenCalledTimes(2);
    
    // Verificar se o toast de sucesso foi mostrado
    expect(toast.success).toHaveBeenCalledWith("Ordem cancelada com sucesso");
  });
});
