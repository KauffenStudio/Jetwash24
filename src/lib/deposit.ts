/**
 * Fixed reservation deposit paid online to confirm the booking.
 * The remaining balance is collected on-site after the job.
 */
export const RESERVATION_FEE = 4.99;

export function calculateDeposit(_totalPrice: number): number {
  return RESERVATION_FEE;
}
