import React from "react";
import {Link} from "react-router-dom";

import logoIcon from "../../assets/images/safe-logot.png";
import loginIcon from "../../assets/images/icons/userlogin.png";
import newuserIcon from "../../assets/images/icons/newuser.png";

import './styles.css';

function Landing() {
    return(
        <div id="page-landing">
            <div id="page-landing-content" className="container">
                <div className="logo-container">
                    <h2>Juntos, pela saúde de todos !</h2>
                </div>
                <img
                src= {logoIcon}
                alt="Plataforma de estudos"
                className="hero-image"
                />
                <div className="buttons-container">
                    <Link to="/user" className="entra">  {/* study */}
                        <img src= {loginIcon} alt="Estudar"/>
                        Entrar
                    </Link>

                    <Link to="/new-user" className="cadastra"> {/* give-classes */}
                        <img src= {newuserIcon} alt="Dar aulas"/>
                        Cadastrar
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Landing;
