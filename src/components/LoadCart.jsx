import { useEffect, useState } from "react";
import "../assets/css/carrito-loader.css";
import { subscribe, removeFromCart, updateQuantity } from "../pages/Carrito";

function CartLoader() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (typeof subscribe !== "function") {
      console.error("subscribe no está definido correctamente");
      return;
    }

    const unsubscribe = subscribe((data) => {
      if (Array.isArray(data)) {
        setCart(data);
      }
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const handleQuantityChange = (id, value) => {
    const cantidad = parseInt(value, 10);

    if (typeof updateQuantity === "function" && cantidad > 0) {
      updateQuantity(id, cantidad);
    }
  };

  const handleRemove = (id) => {
    if (typeof removeFromCart === "function") {
      removeFromCart(id);
    }
  };

  return (
    <section className="carrito">
      <h2>Carrito</h2>

      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="carrito-item">
            <h4>{item.nombre}</h4>
            <p>${item.precio}</p>

            <input
              type="number"
              value={item.cantidad}
              min="1"
              onChange={(e) =>
                handleQuantityChange(item.id, e.target.value)
              }
            />

            <button onClick={() => handleRemove(item.id)}>
              Eliminar
            </button>
          </div>
        ))
      )}
    </section>
  );
}

export default CartLoader;