// Dependencies
import React from "react";
import { connect } from "react-redux";

// Objects

// Styles

const Grant = props => {
  // console.log("Grant props", props);
  return (
    <div className="grant-card">
      <h2>{props.grant.competition_name}</h2>
      <div>{props.grant.amount}</div>
      <div>{props.grant.area_focus}</div>
    </div>
  );
};

export default Grant;
