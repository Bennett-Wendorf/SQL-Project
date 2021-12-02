import React, { useState, useEffect } from "react";
import Bar from "../../components/Bar/Bar";

// Import general mui stuff
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

// Import utilites and components
import api from "../../utils/api";

// Create the Project page component
export function Project() {
  // Setup a general format for dates
  // TODO: Make global??
  const dateFormatOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }

  const [projectTasks, setProjectTasks] = useState ([])

  const updateProjectTasks = () => {
    api.get(`/api/projects/overview`)
    .then(response => {
      // TODO: Check response for error
      setProjectTasks(response.data ? response.data.rows : [])
      console.log("Updating project tasks");
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    updateProjectTasks()
  }, [])

  // For now, return a button to show on this component.
  return (
    <div>
      <Bar title="Project" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="User's Tasks">

          {/* Generate the headers of the rows */}
          <TableHead>
            <TableRow>
              <TableCell>Project Title</TableCell>
              <TableCell align="right">Tasks remaining</TableCell>
              <TableCell align="right">Due</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map each task from the backend to a row in the table */}
            {projectTasks.map((row) => (
              // Handle mouse pointer on hover
              <TableRow
                key={row.TaskID}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.Title}</TableCell>
                <TableCell align="right" size="small">{row.TaskRemaining ? row.TaskRemaining : 0}</TableCell>
                <TableCell align="right" size="medium">{new Date(row.DueDate * 1000).toLocaleDateString("en-US", dateFormatOptions)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
}
