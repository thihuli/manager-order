
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

    // Submeter o formulário sem preencher campos obrigatórios
    await user.click(screen.getByRole('button', { name: 'Criar Ordem' }));
    
    // Verificar mensagens de erro
    await waitFor(() => {
      expect(screen.getByText('Instrumento é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Preço deve ser maior que zero')).toBeInTheDocument();
      expect(screen.getByText('Quantidade deve ser maior que zero')).toBeInTheDocument();
    });
  });

// it('should submit form with valid data', async () => {
//   const user = userEvent.setup();

//   render(
//     <CreateOrderForm 
//       open={true}
//       onOpenChange={mockOnOpenChange}
//       onCreateOrder={mockOnCreateOrder}
//     />
//   );

//   // Abrir o select de instrumento
//   await user.click(screen.getByRole('combobox', { name: /instrumento/i }));
//   screen.debug()
//   // Aguarde o portal renderizar
//   await new Promise(r => setTimeout(r, 100));
//   // Clique na opção
//   await user.click(screen.getAllByRole('option', { name: 'PETR4' })[0]);

//   // Abrir o select de tipo de ordem
//   await user.click(screen.getByRole('combobox', { name: /tipo de ordem/i }));
//   await new Promise(r => setTimeout(r, 100));
//   await user.click(screen.getAllByRole('option', { name: OrderSide.BUY })[0]);

//   // Preencher preço e quantidade
//   const priceInput = screen.getByRole('spinbutton', { name: /preço/i });
//   const quantityInput = screen.getByRole('spinbutton', { name: /quantidade/i });

//   await user.clear(priceInput);
//   await user.type(priceInput, '50.25');

//   await user.clear(quantityInput);
//   await user.type(quantityInput, '100');

//   // Verifique se o botão está habilitado
//   const submitButton = screen.getByRole('button', { name: 'Criar Ordem' });
//   expect(submitButton).toBeEnabled();

//   // Submeter o formulário
//   await user.click(submitButton);

//   // Debug para ver se o mock foi chamado
//   console.log('mock calls:', mockOnCreateOrder.mock.calls);

//   // Verificar se a função onCreateOrder foi chamada com os valores corretos
//   await waitFor(() => {
//     expect(mockOnCreateOrder).toBeCalledWith({
//       instrument: 'PETR4',
//       side: OrderSide.BUY,
//       price: 50.25,
//       quantity: 100
//     });
//   });

//   // Verificar se o diálogo foi fechado
//   expect(mockOnOpenChange).toHaveBeenCalledWith(false);
// });

  // it('should handle API errors', async () => {
  //   const user = userEvent.setup();
  //   mockOnCreateOrder.mockRejectedValue(new Error('Erro ao criar ordem'));
    
  //   render(
  //     <CreateOrderForm 
  //       open={true}
  //       onOpenChange={mockOnOpenChange}
  //       onCreateOrder={mockOnCreateOrder}
  //     />
  //   );

  //   // Preencher o formulário com dados válidos
  //   // Selecionar um instrumento
  //   await user.click(screen.getByRole('combobox', { name: /instrumento/i }));
  //   await waitFor(() => {
  //     expect(screen.getByRole('option', { name: 'PETR4' })).toBeInTheDocument();
  //   });
  //   await user.click(screen.getByRole('option', { name: 'PETR4' }));

  //   await user.click(screen.getByRole('combobox', { name: /tipo de ordem/i }));
  //   await waitFor(() => {
  //     expect(screen.getByRole('option', { name: OrderSide.BUY })).toBeInTheDocument();
  //   });
  //   await user.click(screen.getByRole('option', { name: OrderSide.BUY }));
    
  //   // Preencher preço e quantidade
  //   const priceInput = screen.getByRole('spinbutton', { name: /preço/i });
  //   const quantityInput = screen.getByRole('spinbutton', { name: /quantidade/i });
    
  //   await user.clear(priceInput);
  //   await user.type(priceInput, '50.25');
    
  //   await user.clear(quantityInput);
  //   await user.type(quantityInput, '100');
    
  //   // Submeter o formulário
  //   const submitButton = screen.getByRole('button', { name: 'Criar Ordem' });
  //   expect(submitButton).toBeEnabled();
  //   await user.click(screen.getByRole('button', { name: 'Criar Ordem' }));
    
  //   // Verificar se a função onCreateOrder foi chamada
  //   await waitFor(() => {
  //     expect(mockOnCreateOrder).toHaveBeenCalled();
  //   });
    
  //   // Verificar se o diálogo não foi fechado
  //   expect(mockOnOpenChange).not.toHaveBeenCalledWith(false);
  // });
});
