// src/components/AntivirusCard.jsx

import React from 'react';
import './AntivirusCard.css';

const AntivirusCard = ({ name, price, devices, duration }) => {
  return (
    <div className="antivirus-card">
      <div className="card-header">
        <h2>{name}</h2>
      </div>
      <div className="card-body">
        <p className="card-price">RON {price}/luna</p>
        <p className="card-devices">Pentru {devices} dispozitive</p>
      </div>
      <button className="card-button">Vezi detalii</button>
    </div>
  );
};

export default AntivirusCard;
