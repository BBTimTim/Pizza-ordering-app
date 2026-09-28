// A rendelés státuszainak magyar nevei és színei (a backend OrderController::STATUSES alapján)
export const ORDER_STATUSES = {
  pending: { label: "Feldolgozás alatt", className: "badge-warning" },
  out_for_delivery: { label: "Kiszállítás alatt", className: "badge-info" },
  delivered: { label: "Kiszállítva", className: "badge-success" },
  cancelled: { label: "Törölve", className: "badge-error" },
};

export const PAYMENT_STATUSES = {
  paid: { label: "Fizetve", className: "badge-success" },
  not_paid: { label: "Nem fizetett", className: "badge-ghost" },
};

export const formatPrice = (amount) =>
  `${Number(amount).toLocaleString("hu-HU", { maximumFractionDigits: 0 })} Ft`;

export const formatDate = (date) =>
  new Date(date).toLocaleString("hu-HU", { dateStyle: "medium", timeStyle: "short" });
