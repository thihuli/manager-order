
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateOrderForm } from '../CreateOrderForm';
import { OrderSide } from '../../constants';

describe('CreateOrderForm', () => {
  const mockOnCreateOrder = vi.fn();
  const mockOnOpenChange = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    mockOnCreateOrder.mockResolvedValue(true);
    if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  });

  it('should render the form correctly when open', () => {
    render(
      <CreateOrderForm 
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreateOrder={mockOnCreateOrder}
      />
    );

    expect(screen.getByText('Nova Ordem')).toBeInTheDocument();
    expect(screen.getByText('Instrumento')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Ordem')).toBeInTheDocument();
    expect(screen.getByText('Preço')).toBeInTheDocument();
    expect(screen.getByText('Quantidade')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Criar Ordem' })).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <CreateOrderForm 
        open={false}
        onOpenChange={mockOnOpenChange}
        onCreateOrder={mockOnCreateOrder}
      />
    );

    expect(screen.queryByText('Nova Ordem')).not.toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    
    render(
      <CreateOrderForm 
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreateOrder={mockOnCreateOrder}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Criar Ordem' }));
    
    await waitFor(() => {
      expect(screen.getByText('Instrumento é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Preço deve ser maior que zero')).toBeInTheDocument();
      expect(screen.getByText('Quantidade deve ser maior que zero')).toBeInTheDocument();
    });
  });

it('should submit form with valid data', async () => {
  const user = userEvent.setup();

  render(
    <CreateOrderForm 
      open={true}
      onOpenChange={mockOnOpenChange}
      onCreateOrder={mockOnCreateOrder}
    />
  );
  await user.click(screen.getByRole('combobox', { name: /instrumento/i }));
  await waitFor(() => {
      expect(screen.getByRole('option', { name: 'PETR4' })).toBeInTheDocument();
    });
  await user.click(screen.getByRole('option', { name: 'PETR4' }));

  await user.click(screen.getByRole('combobox', { name: /tipo de ordem/i }));
  await waitFor(() => {
      expect(screen.getByRole('option', { name: OrderSide.BUY })).toBeInTheDocument();
    });

  await user.click(screen.getByRole('option', { name: OrderSide.BUY }));
  const priceInput = screen.getByRole('spinbutton', { name: /preço/i });
  const quantityInput = screen.getByRole('spinbutton', { name: /quantidade/i });
  expect(priceInput).toBeInTheDocument();
  expect(quantityInput).toBeInTheDocument();

  await user.clear(priceInput);
  await user.type(priceInput, '50.25');
  await user.tab();

  await user.clear(quantityInput);
  await user.type(quantityInput, '100');
  await user.tab();


  const form = document.querySelector('form');
  if (form) {
    fireEvent.submit(form);
  }

  await waitFor(() => {
    expect(mockOnCreateOrder).toHaveBeenCalledWith({
        instrument: 'PETR4',
        side: OrderSide.BUY,
        price: 50.25,
        quantity: 100,
      });
  }, { timeout: 1000 });

});

  it('should handle API errors', async () => {
    const user = userEvent.setup();
    mockOnCreateOrder.mockRejectedValue(new Error('Erro ao criar ordem'));
    
    render(
      <CreateOrderForm 
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreateOrder={mockOnCreateOrder}
      />
    );

    await user.click(screen.getByRole('combobox', { name: /instrumento/i }));
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'PETR4' })).toBeInTheDocument();
    });
    await user.click(screen.getByRole('option', { name: 'PETR4' }));

    await user.click(screen.getByRole('combobox', { name: /tipo de ordem/i }));
    await waitFor(() => {
      expect(screen.getByRole('option', { name: OrderSide.BUY })).toBeInTheDocument();
    });
    await user.click(screen.getByRole('option', { name: OrderSide.BUY }));
    

    const priceInput = screen.getByRole('spinbutton', { name: /preço/i });
    const quantityInput = screen.getByRole('spinbutton', { name: /quantidade/i });
    
    await user.clear(priceInput);
    await user.type(priceInput, '50.25');
    await user.tab();
    
    await user.clear(quantityInput);
    await user.type(quantityInput, '100');
    await user.tab();
    
    const form = document.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    await waitFor(() => {
      expect(mockOnCreateOrder).toHaveBeenCalled();
    });
    
    expect(mockOnOpenChange).not.toHaveBeenCalledWith(false);
  });
});
