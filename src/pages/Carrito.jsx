import { useEffect, useState } from "react";
import "../assets/css/carrito.css";

let cart = [];
let listeners = [];


const notify = () => {
  listeners.forEach((listener) => listener([...cart]));
};


export const addToCart = (product) => {
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.cantidad += 1;
  } else {
    cart.push({ ...product, cantidad: 1 });
  }

  notify();
};

export const removeFromCart = (id) => {
  cart = cart.filter((item) => item.id !== id);
  notify();
};

export const updateQuantity = (id, cantidad) => {
  const item = cart.find((i) => i.id === id);
  if (item && cantidad > 0) {
    item.cantidad = cantidad;
  }
  notify();
};

export const subscribe = (listener) => {
  listeners.push(listener);
  listener([...cart]);

  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};


function Cart() {
  return <section></section>;
}

export default Cart;