import React from "react";
import "./Project.css";
import Button from '@mui/material/Button';
import Bar from "../../components/Bar/Bar"; 
import DropDownIcon from '@mui/icons-material/ArrowDropDownCircle';

export function Project() {

  // For now, return a button to show on this component. // TODO: Change this to more useful content
  return (
    <div>
      <Bar title="Project">
        <Button aria-label="projects" size="medium" justify="left" startIcon={<DropDownIcon />}>
          Project {/* TODO Add a project dropdown here using <Select />*/}
        </Button>
      </Bar>
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
