import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';

describe('Card Component', () => {
  test('renders children correctly', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('renders title when provided', () => {
    render(
      <Card title="Test Title">
        <p>Test content</p>
      </Card>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('does not render title section when no title is provided', () => {
    const { container } = render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    expect(container.querySelector('.border-b')).not.toBeInTheDocument();
  });

  test('applies shadow when shadow prop is true', () => {
    const { container } = render(
      <Card shadow>
        <p>Test content</p>
      </Card>
    );
    
    expect(container.firstChild).toHaveClass('shadow-md');
  });

  test('does not apply shadow when shadow prop is false', () => {
    const { container } = render(
      <Card shadow={false}>
        <p>Test content</p>
      </Card>
    );
    
    expect(container.firstChild).not.toHaveClass('shadow-md');
  });

  test('applies border when bordered prop is true', () => {
    const { container } = render(
      <Card bordered>
        <p>Test content</p>
      </Card>
    );
    
    expect(container.firstChild).toHaveClass('border');
    expect(container.firstChild).toHaveClass('border-gray-200');
  });

  test('does not apply border when bordered prop is false', () => {
    const { container } = render(
      <Card bordered={false}>
        <p>Test content</p>
      </Card>
    );
    
    expect(container.firstChild).not.toHaveClass('border');
    expect(container.firstChild).not.toHaveClass('border-gray-200');
  });

  test('applies padding to content by default', () => {
    const { container } = render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    
    const contentDiv = container.querySelector('div > div:last-child');
    expect(contentDiv).toHaveClass('p-4');
  });

  test('does not apply padding when noPadding is true', () => {
    const { container } = render(
      <Card noPadding>
        <p>Test content</p>
      </Card>
    );
    
    const contentDiv = container.querySelector('div > div:last-child');
    expect(contentDiv).not.toHaveClass('p-4');
  });

  test('applies additional className when provided', () => {
    const { container } = render(
      <Card className="test-class">
        <p>Test content</p>
      </Card>
    );
    
    expect(container.firstChild).toHaveClass('test-class');
  });

  test('passes additional props to the root element', () => {
    const { container } = render(
      <Card data-testid="test-card" id="custom-id">
        <p>Test content</p>
      </Card>
    );
    
    const cardElement = container.firstChild;
    expect(cardElement).toHaveAttribute('data-testid', 'test-card');
    expect(cardElement).toHaveAttribute('id', 'custom-id');
  });
}); 