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

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

function buildTable(props) {

  var rows = [];
  if(props){
    rows = props
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="User's Tasks">
        <TableHead>
          <TableRow>
            <TableCell>TaskID</TableCell>
            <TableCell align="right">Title</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.TaskID}
              </TableCell>
              <TableCell align="right">{row.Title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

// Define this component
export function UserTasks() {

  // Define a piece of state to use to store information from the api call
  const [tasks, setTasks] = useState([])

  // The first time this component renders, make an api call to the backend endpoint and set that response to the piece of state
  useEffect(() => api.get('/api/tasks')
    .then(response => { 
      setTasks(response)
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
      {buildTable(tasks.data.rows)}
    </div>
  );
}
