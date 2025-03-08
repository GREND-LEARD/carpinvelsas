import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alert from './Alert';

describe('Alert Component', () => {
  test('renders children correctly', () => {
    render(
      <Alert>
        <p>Test alert message</p>
      </Alert>
    );
    
    expect(screen.getByText('Test alert message')).toBeInTheDocument();
  });

  test('renders title when provided', () => {
    render(
      <Alert title="Important Information">
        <p>Test alert message</p>
      </Alert>
    );
    
    expect(screen.getByText('Important Information')).toBeInTheDocument();
  });

  test('applies info styles by default', () => {
    const { container } = render(
      <Alert>Test alert</Alert>
    );
    
    expect(container.firstChild).toHaveClass('bg-blue-50');
    expect(container.firstChild).toHaveClass('border-blue-200');
  });

  test('applies success styles correctly', () => {
    const { container } = render(
      <Alert type="success">Success message</Alert>
    );
    
    expect(container.firstChild).toHaveClass('bg-green-50');
    expect(container.firstChild).toHaveClass('border-green-200');
  });

  test('applies warning styles correctly', () => {
    const { container } = render(
      <Alert type="warning">Warning message</Alert>
    );
    
    expect(container.firstChild).toHaveClass('bg-yellow-50');
    expect(container.firstChild).toHaveClass('border-yellow-200');
  });

  test('applies error styles correctly', () => {
    const { container } = render(
      <Alert type="error">Error message</Alert>
    );
    
    expect(container.firstChild).toHaveClass('bg-red-50');
    expect(container.firstChild).toHaveClass('border-red-200');
  });

  test('does not show dismiss button when dismissible is false', () => {
    render(
      <Alert>Non-dismissible alert</Alert>
    );
    
    expect(screen.queryByLabelText('Cerrar')).not.toBeInTheDocument();
  });

  test('shows dismiss button when dismissible is true and onDismiss provided', () => {
    render(
      <Alert dismissible onDismiss={() => {}}>
        Dismissible alert
      </Alert>
    );
    
    expect(screen.getByLabelText('Cerrar')).toBeInTheDocument();
  });

  test('calls onDismiss when dismiss button is clicked', () => {
    const handleDismiss = jest.fn();
    
    render(
      <Alert dismissible onDismiss={handleDismiss}>
        Dismissible alert
      </Alert>
    );
    
    fireEvent.click(screen.getByLabelText('Cerrar'));
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  test('applies additional className when provided', () => {
    const { container } = render(
      <Alert className="custom-class">
        Alert with custom class
      </Alert>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('passes additional props to the alert container', () => {
    const { container } = render(
      <Alert data-testid="test-alert" id="custom-id">
        Alert with custom props
      </Alert>
    );
    
    expect(container.firstChild).toHaveAttribute('data-testid', 'test-alert');
    expect(container.firstChild).toHaveAttribute('id', 'custom-id');
  });

  test('renders with the correct role attribute', () => {
    const { container } = render(
      <Alert>Accessibility test</Alert>
    );
    
    expect(container.firstChild).toHaveAttribute('role', 'alert');
  });
}); 