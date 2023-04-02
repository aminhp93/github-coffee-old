import { render, screen } from '@testing-library/react';
import Test from './Test';

export const addTwoNumbers = (a: number, b: number) => {
  return a + b;
};

describe('test', () => {
  it('should add two numbers together', () => {
    expect(addTwoNumbers(2, 4)).toEqual(6);
    expect(addTwoNumbers(10, 10)).toEqual(20);
  });
});

describe('Test', () => {
  it('renders Test component', async () => {
    render(<Test />);
    const button = screen.getByRole('button');
    expect(button).toBeTruthy();
  });
});
