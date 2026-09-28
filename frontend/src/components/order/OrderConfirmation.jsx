import emailjs from "@emailjs/browser";

export const sendOrderConfirmation = (order) => {

  const service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const template_id = import.meta.env.VITE_EMAILJS_TEMPLATE_ID2;
  const public_key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const template_params = {
        order_id: order.id,
        email: order.email,
        shipping: order.delivery_charges,
        subtotal: order.sub_total,
        total: order.grand_total,

         orders: order.items.map((item) => ({
            // A méret és a feltétek a névben jelennek meg, így a sablon változtatás nélkül mutatja őket
            name: [
              item.name,
              item.size_name && `(${item.size_name})`,
              item.toppings?.length && `+ ${item.toppings.map((t) => t.name).join(", ")}`,
            ].filter(Boolean).join(" "),
            quantity: item.quantity,
            price: item.price,
        })),
  };

  return emailjs
    .send(service_id, template_id, template_params, {
      publicKey: public_key,
    })
    .then(
      () => true,
      (error) => {
        // Az EmailJS a hiba okát szövegként adja vissza (pl. nem engedélyezett domain, elfogyott keret)
        console.error("EmailJS hiba:", error?.status, error?.text);
        return false;
      },
    );
};
