/** Drop server-painted payment shell once Stripe Payment Element is ready. */
export function removePaymentInstantShell(): void {
  document.querySelectorAll("[data-velora-payment-instant]").forEach((node) => {
    node.remove();
  });
}
