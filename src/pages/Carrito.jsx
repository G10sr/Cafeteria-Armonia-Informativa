import { useEffect, useState } from "react";
import "../assets/css/carrito.css";
import LoadCart from "../components/LoadCart";
import AppearingText from "../components/AppearingText";

let cartData = { items: [] };
let listeners = [];

const notify = () => {
  listeners.forEach((listener) => listener({ ...cartData }));
};

const saveCart = async () => {
  try {
    await fetch("http://localhost:3001/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cartData.lastAddedId || "" }),
    });
  } catch (e) {
    console.error("Save failed", e);
  }
};

const loadCart = async () => {
  try {
    const res = await fetch("http://localhost:3001/api/cart");
    const data = await res.json();
    cartData = data;
    notify();
  } catch (e) {
    console.error("Load failed", e);
  }
};

loadCart();

export const addToCart = async (id) => {
  const existing = cartData.items.find((item) => item.id === id);
  if (existing) {
    existing.cantidad += 1;
  } else {
    cartData.items.push({ id, cantidad: 1 });
  }
  cartData.lastAddedId = id;
  notify();
  await saveCart();
};

export const removeFromCart = async (id) => {
  cartData.items = cartData.items.filter((item) => item.id !== id);
  notify();
  await saveCart();
};

export const updateQuantity = async (id, cantidad) => {
  const item = cartData.items.find((i) => i.id === id);
  if (item && cantidad > 0) {
    item.cantidad = cantidad;
  }
  notify();
  await saveCart();
};

export const subscribe = (listener) => {
  listeners.push(listener);
  listener(cartData);

  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};


function Cart() {
  return (
    
    <section className="carrito-page">
      <AppearingText key="valores" className="text">
        Carrito
      </AppearingText>      
      <LoadCart />
    </section>
  );
}

export default Cart;