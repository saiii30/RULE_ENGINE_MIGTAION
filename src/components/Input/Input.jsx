import React from "react";
import "./Input.css";

export const Input = ({ onSubmit,handleAddGroup}) => (
  <div className="container">
    <button className="btn" onClick={() => onSubmit("rule")}>Add Rule</button>
    <button className="btn" onClick={handleAddGroup}>Add Group</button>
  </div>
);
