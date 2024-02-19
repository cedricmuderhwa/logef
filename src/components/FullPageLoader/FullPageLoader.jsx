import React from "react";
import "./Loader.scss";

function FullPageLoader() {
  return (
    <div className="loader-container">
      <div className="loader">
        <div style={{ position: 'relative' }}>
          <img src='./rdc.png' style={{ position: 'absolute', height: 90, width: 'auto', top:25, left:25 }} alt="emblem drc" />
          <img src='./loading.gif' style={{ height:140, width:'auto' }} alt="Loading..." />
          
        </div>
        <p className="text-right">Chargement...</p>
      </div>
    </div>
  )
}

export default FullPageLoader

