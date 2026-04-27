import { useEffect, useState } from "react";
import "../assets/css/carrito-loader.css";
import { subscribe, removeFromCart, updateQuantity } from "../pages/Carrito";

/**
 * ESTRUCTURA DEL CARRITO:
 * {
 *   items: [
 *     { id, cantidad }
 *   ]
 * }
 */

function CartLoader() {
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    const unsubscribe = subscribe((data) => {
      setCart(data || { items: [] });
    });

    return unsubscribe;
  }, []);

  const handleQuantityChange = (id, value) => {
    const cantidad = parseInt(value, 10);

    if (cantidad > 0) {
      updateQuantity(id, cantidad);
    }
  };

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  return (
    <section className="carrito">
      <h2>Carrito</h2>

      {cart.items.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        cart.items.map((item) => (
          <div className="carrito">
        <h2>Tu carrito</h2>

        {cart.items.length === 0 ? (
          <p>El carrito está vacío</p>
        ) : (
          cart.items.map((item) => (
            <div key={item.id} className="carrito-item">
              <h4>Producto ID: {item.id}</h4>

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
        ))
      )}
    </section>
  );
}

export default CartLoader;