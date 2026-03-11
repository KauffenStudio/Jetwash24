/**
 * Calculates the deposit amount a customer pays online.
 * The deposit is 20% of the total price, with a minimum of €5.
 */
export function calculateDeposit(totalPrice: number): number {
  return Math.max(5, Math.round(totalPrice * 0.2 * 100) / 100);
}
