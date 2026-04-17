import "../assets/css/footer.css";
import logo from "../assets/img/arLogo.jpg"

function Footer(){
    return(
        <div id="Footer">
            <p>Armonía<br /> Todos los derechos reservados <br/>Num: 6110 3229</p>
            <img src={logo}></img>
        </div>
    )
}
export default Footer;