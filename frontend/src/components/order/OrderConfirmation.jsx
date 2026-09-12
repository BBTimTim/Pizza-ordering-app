import React from "react";
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
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        })),
  };

  return emailjs
    .send(service_id, template_id, template_params, {
      publicKey: public_key,
    })
    .then(
      (response) => {
        console.log("Email elküldve!", response.status, response.text);
      },
      (error) => {
        console.log("Hiba történt...", error);
      },
    );
};
