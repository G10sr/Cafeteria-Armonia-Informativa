import '../assets/css/productCard.css';
import Button from "./CustomButton";
import { addToCart } from "./Carrito";

function ProductCard({ product }) {

  return (
    <div className="producto">
      <img src={product.imagen} alt={product.nombre} />
      <h3>{product.nombre}</h3>
      <p>{product.descripcion}</p>
      <p>${product.precio}</p>

      <Button onClick={() => addToCart(product)}>
        Comprar
      </Button>
    </div>
  );
}
 
export default ProductCard;