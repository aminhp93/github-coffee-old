export const addTwoNumbers = (a: number, b: number) => {
  return a + b;
};

describe('test', () => {
  it('should add two numbers together', () => {
    expect(addTwoNumbers(2, 4)).toEqual(6);
    expect(addTwoNumbers(10, 10)).toEqual(20);
  });
});
