
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../StatusBadge';
import { OrderStatus } from '../../constants';

describe('StatusBadge', () => {
  it('should render correctly with OPEN status', () => {
    render(<StatusBadge status={OrderStatus.OPEN} />);
    expect(screen.getByText(OrderStatus.OPEN)).toBeInTheDocument();
    // Verificar classe de cor para status OPEN
    const badge = screen.getByText(OrderStatus.OPEN).closest('div');
    expect(badge).toHaveClass('bg-blue-100');
  });
  
  it('should render correctly with EXECUTED status', () => {
    render(<StatusBadge status={OrderStatus.EXECUTED} />);
    expect(screen.getByText(OrderStatus.EXECUTED)).toBeInTheDocument();
    // Verificar classe de cor para status EXECUTED
    const badge = screen.getByText(OrderStatus.EXECUTED).closest('div');
    expect(badge).toHaveClass('bg-green-100');
  });

  it('should render correctly with PARTIAL status', () => {
    render(<StatusBadge status={OrderStatus.PARTIAL} />);
    expect(screen.getByText(OrderStatus.PARTIAL)).toBeInTheDocument();
    // Verificar classe de cor para status PARTIAL
    const badge = screen.getByText(OrderStatus.PARTIAL).closest('div');
    expect(badge).toHaveClass('bg-amber-100');
  });

  it('should render correctly with CANCELLED status', () => {
    render(<StatusBadge status={OrderStatus.CANCELLED} />);
    expect(screen.getByText(OrderStatus.CANCELLED)).toBeInTheDocument();
    // Verificar classe de cor para status CANCELLED
    const badge = screen.getByText(OrderStatus.CANCELLED).closest('div');
    expect(badge).toHaveClass('bg-red-100');
  });
});
