import React from "react";
import "./LiveCss.css";
import Data from "../HealthRecord/Data";
import CurrentData from "../CurrentData/CurrentData";

function Live() {
  return (
    <div className="ContainerGrid">
      <div className="box1">Messages</div>
      <div className="box2">
        <h2>Vitals Monitoring</h2>
        <ul style={{listStyle:"none",display:"flex",justifyContent:"space-around"}}>
          <li><a href="#">Heart Rate</a>
          <div className="buttons">
          <button className="start-btn">Start</button>
          <button className="stop-btn">Stop</button>
        </div></li>
          <li><a href="#">SpO2</a>
          <div className="buttons">
          <button className="start-btn">Start</button>
          <button className="stop-btn">Stop</button>
        </div></li>
          <li><a href="#">Body Temperature</a> <div className="buttons">
          <button className="start-btn">Start</button>
          <button className="stop-btn">Stop</button>
        </div></li>
        </ul>
        
      </div>
      <div className="box3"><CurrentData/></div>
      <div className="box4"><Data/> </div>
    </div>

  );
}

export default Live;
