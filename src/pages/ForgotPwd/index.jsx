import React from "react";
import { BsQuestionCircle } from "react-icons/bs";
import Footer from "../../layouts/Footer";
import "./fgtpwd.scss";

function ForgotPwdPage() {
  return (
    <div className="main-wrapper">
      <div className="main-container">
        <div className="dt-container">
          <div className="head-title">
            <BsQuestionCircle
              size={140}
              color="#228be6"
              style={{ marginRight: 24 }}
            />
            <div className="head-title-text">
              <h1>Avez-vous oublié votre mot de passe ?</h1>
              <p>Veuillez contacter votre administrateur pour le rénouveler.</p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default ForgotPwdPage;
