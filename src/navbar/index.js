import React, { useState, useRef } from "react";
import  {Container} from './styles';
import logo from "../images/logo.svg";


export default function NavBar (){

    return (
        <Container>
            <div className="header-container">
                <img src={logo} alt="logo123 milhas"/>
            </div>
        </Container>
    )
}