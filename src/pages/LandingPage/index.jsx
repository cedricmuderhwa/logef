import { Button } from "@mantine/core";
import React from "react";
import { BsBoxArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Footer from "../../layouts/Footer";
import "./landingpage.scss";

function LandingPage() {
  const navigate = useNavigate();

  function goToLogin() {
    navigate("/login");
  }

  return (
    <div className="main-wrapper">
      <div className="main-container">
        <div className="dt-container">
          <div className="head-title">
            <img src="./blue-2.svg" alt="CNLFM" />
            <div className="head-title-text">
              <h1>
                Commission Nationale de Lutte <br />
                contre la Fraude Minière
              </h1>
              <p>République Démocratique du Congo</p>
            </div>
          </div>
          {/* <h1>CNLFM</h1> */}
          <div className="head-description">
            <p>
              En sigle CNLFM, est une structure créée par l'arreté
              interministériel Nº0719/CAB.MIN/MINES/01/2010 et <br />
              Nº140/CAB.NIM/INT.SEC/2010 du 20 Juillet 2010, portant création,
              organisation et fonctionnement de <br /> la Commission Nationale
              de Lutte contre la Fraude Minière, "CNLFM", en sigle.
              <br />
              <br />
              Pour faciliter la gestion et le suivi des cas de fraude dans la
              transparence, en collaboration avec l'Organisation
              <br /> Internationale des migrations (OIM), le logiciel de gestion
              de la fraude miniere a ete mis en place.
              <br />
              Pour utiliser cet outil, veuillez vous connecter en cliquant sur
              le bouton ci-dessous:
            </p>
            <Button
              onClick={() => goToLogin()}
              className="get_started"
              size="lg"
              compact
              leftIcon={<BsBoxArrowRight />}
            >
              Se connecter
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
