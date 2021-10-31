// Import React stuff
import React, { useState, useEffect } from "react";

// Import css and api
import "./UserTasks.css";
import api from "../../utils/api";
import Bar from "../../components/Bar/Bar";
import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/AddCircle';
import FilterIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';

// Define this component
export function UserTasks() {

  // Define a piece of state to use to store information from the api call
  const [firstTask, setFirstTask] = useState({})

  // The first time this component renders, make an api call to the backend endpoint and set that response to the piece of state
  useEffect(() => api.get('/api/tasks')
    .then(response => { 
      setFirstTask(response)
    })
    .catch(err => console.log(err)), [])

  // Return some JSX definine 3 labels with task data from the api call
  return (
    <div>
      <Bar title="User Tasks">
        <IconButton aria-label="add" size="large" justify="left">
          <AddIcon />
        </IconButton>
        <IconButton aria-label="sort" size="large" justify="right">
          <SortIcon />
        </IconButton>
        <IconButton aria-label="filter" size="large" justify="right">
          <FilterIcon />
        </IconButton>
      </Bar>
      <label>{firstTask['data'] ? firstTask['data']['data'][0]['Title'] : ""}</label>
      <br/>
      <label>{firstTask['data'] ? firstTask['data']['data'][1]['Title'] : ""}</label>
      <br/>
      <label>{firstTask['data'] ? firstTask['data']['data'][2]['Title'] : ""}</label>
    </div>
  );
}
