export const addToCart = (product) => {
  const storedCart = JSON.parse(localStorage.getItem("carrito")) || [];

  const existing = storedCart.find((item) => item.id === product.id);

  if (existing) {
    existing.cantidad += 1;
  } else {
    storedCart.push({ ...product, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(storedCart));

  window.dispatchEvent(new Event("cartUpdated"));
};