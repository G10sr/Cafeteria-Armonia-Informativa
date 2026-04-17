import { useEffect, useState } from "react";
import "../assets/css/carrito-loader.css";
import { subscribe, removeFromCart, updateQuantity } from "./Carrito";

function CartLoader() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribe(setCart);
    return () => unsubscribe();
  }, []);

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
                updateQuantity(item.id, parseInt(e.target.value))
              }
            />

            <button onClick={() => removeFromCart(item.id)}>
              Eliminar
            </button>
          </div>
        ))
      )}
    </section>
  );
}

export default CartLoader;