import React from "react";
import "./Manage.css";
import Button from '@mui/material/Button';
import Bar from "../../components/Bar/Bar";

export function Manage() {

  // For now, return a button to show on this component. // TODO: Change this to more useful content
  return (
    <div>
      <Bar title="Manage"/>
      <Button
        id="clear-btn"
        variant="contained"
        color="primary"
      >
        Clear Console
      </Button>
    </div>
  );
}
