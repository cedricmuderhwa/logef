import React from "react";

function Footer({ landing }) {
  return (
    <div
      className="footer"
      style={{
        padding: "0 14px",
        textAlign: "center",
        lineHeight: 8,
        paddingBottom: window.innerWidth <= 1080 ? 72 : null,
      }}
    >
      <p>
        {" "}
        Copyright &#169; {new Date().getFullYear()} CNLFM. Tout droits reservés.
      </p>
    </div>
  );
}

export default Footer;
