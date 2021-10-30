import React from "react";
import "./Project.css";
import Button from '@mui/material/Button';

export function Project() {

  // For now, return a button to show on this component. // TODO: Change this to more useful content
  return (
    <div>
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
