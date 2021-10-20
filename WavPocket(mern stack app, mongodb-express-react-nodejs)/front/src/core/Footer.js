import React from 'react'
import { Link } from "react-router-dom";
import logo3 from "../images/logo3.png"

const Footer = () => {
    return (
        <footer>
            <div className="container">
            <Link to="/">
                <img src={logo3} alt="Logo" className="logo2" />
            </Link>
            </div>
        </footer>
    )
}

export default Footer;
