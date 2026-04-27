import { useEffect, useState } from "react";
import "../assets/css/carrito.css";
import "../assets/css/carrito-loader.css";
import AppearingText from "../components/AppearingText";

/**
 * ESTRUCTURA GLOBAL DEL CARRITO:
 * {
 *   items: [
 *     { id, cantidad }
 *   ]
 * }
 */

let cartData = { items: [] };
let listeners = [];

// 🔔 Notificar cambios a todos los subscribers
const notify = () => {
  listeners.forEach((listener) => listener({ ...cartData }));
};

// Guardar carrito en backend
const saveCart = async () => {
  try {
    await fetch("http://localhost:3001/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartData),
    });
  } catch (e) {
    console.error("Save failed", e);
  }
};

// Cargar carrito desde backend
const loadCart = async () => {
  try {
    const res = await fetch("http://localhost:3001/api/cart");
    const data = await res.json();

    cartData = data || { items: [] };
    notify();
  } catch (e) {
    console.error("Load failed", e);
  }
};

loadCart();

// Agregar producto
export const addToCart = async (product) => {
  const existing = cartData.items.find((item) => item.id === product.id);

  if (existing) {
    existing.cantidad += 1;
  } else {
    cartData.items.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      cantidad: 1,
    });
  }

  notify();
  await saveCart();
};
// Eliminar producto
export const removeFromCart = async (id) => {
  cartData.items = cartData.items.filter((item) => item.id !== id);

  notify();
  await saveCart();
};

// Actualizar cantidad
export const updateQuantity = async (id, cantidad) => {
  const item = cartData.items.find((i) => i.id === id);

  if (item && cantidad > 0) {
    item.cantidad = cantidad;
  }

  notify();
  await saveCart();
};

// Suscripción global
export const subscribe = (listener) => {
  listeners.push(listener);

  listener({ ...cartData });

  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

//limpiar el carrito
export const clearCart = async () => {
  try {
    cartData.items = [];

    await saveCart();

    alert("Compra realizada con éxito");
  } catch (error) {
    console.error("Error al finalizar la compra:", error);
    alert("Ocurrió un error al procesar la compra");
  }
};

// COMPONENTE CART (todo unificado aquí)
function Cart() {
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    const unsubscribe = subscribe((data) => {
      setCart(data || { items: [] });
    });

    return unsubscribe;
  }, []);

  return (
    <section className="carrito-page">
      <AppearingText className="text">
        Carrito
      </AppearingText>

      <div className="carrito">
        <h2>Tu carrito</h2>

        {cart.items.length === 0 ? (
          <p>El carrito está vacío</p>
        ) : (
          cart.items.map((item) => (
            <div key={item.id} className="carrito-item">
              <h4>{item.nombre}</h4>

              <p>Precio: ${item.precio}</p>
              <p>Total: ${item.precio * item.cantidad}</p>

              <input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(e) =>
                  updateQuantity(item.id, parseInt(e.target.value))
                }
              />

              <button onClick={() => removeFromCart(item.id)}>
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
      {cart.items.length > 0 && (
        <button className="buy-button" onClick={clearCart}>
          Comprar
        </button>
      )}
    </section>
  );
}

export default Cart;