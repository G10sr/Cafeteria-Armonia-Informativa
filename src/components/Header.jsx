import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import "../assets/css/header.css";
import logo1 from "../assets/img/arLogo.jpg";
import { subscribe } from "../pages/Carrito";

function Header() {

    const location = useLocation();
    const [cartCount, setCartCount] = useState(0);
    const [text, setText] = useState({
        alt: "Armonía Logo Foto",
        option1: "Home",
        option2: "Productos",
    });

    useEffect(() => {
        const unsubscribe = subscribe((cart) => {
            const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
            setCartCount(totalItems);
        });
        return unsubscribe;
    }, []);

    return (
        <header>
            <img src={logo1} alt={text.alt}/>
            <div id="button-Div">
                <Link to="/">
                    <button className={`btn ${location.pathname === "/" ? "active" : ""}`}>{text.option1}</button>
                </Link>
                <Link to="/productos">
                    <button className={`btn ${location.pathname === "/productos" ? "active" : ""}`}>{text.option2}</button>
                </Link>
                <Link to="/carrito">
                    <div className="cart-container">
                        <FontAwesomeIcon
                        id="cart-icon"
                        className={`btn ${location.pathname === "/carrito" ? "active" : ""}`} 
                        icon={faBasketShopping} 
                        />
                        {cartCount > 0 && (
                            <span className="cart-count">{cartCount}</span>
                        )}
                    </div>
                </Link>
            </div>
        </header>
    );
}

export default Header;