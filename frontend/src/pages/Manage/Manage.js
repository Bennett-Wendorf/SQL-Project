import React from "react";
import Button from '@mui/material/Button';
import Bar from "../../components/Bar/Bar";

// Create the manage page component
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
