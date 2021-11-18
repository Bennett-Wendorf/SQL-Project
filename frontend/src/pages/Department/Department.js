import React, { useState, useEffect } from "react";
import Bar from "../../components/Bar/Bar";

// Import general mui stuff
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Typography } from "@mui/material";

// Import utilites and components
import api from "../../utils/api";

// Create the manage page component
export function Department() {

  const [freeUsers, setFreeUsers] = useState([])
  const [bestUser, setBestUser] = useState({})

  // TODO: Make this refresh when tasks are reassigned
  const updateFreeUsers = () => {
    api.get('/api/people/free')
      .then(response => {
        // TODO: Check for error response
        setFreeUsers(response.data ? response.data.rows : [])
        console.log("Updating free users")
      })
      .catch(err => console.log(err))
  }

  // TODO: Update this incrementally
  const updateBestUser = () => {
    api.get('/api/people/best')
      .then(response => {
        // TODO: Check for error response
        setBestUser(response.data ? response.data : {})
        console.log("Updating best user")
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    updateFreeUsers()
    updateBestUser()
  }, [])
 
  return (
    <>
      <Bar title="Department"/>
      <Toolbar>Free Users</Toolbar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Free Users">

          {/* Generate the headers of the rows */}
          <TableHead>
            <TableRow>
              <TableCell align="left">First Name</TableCell>
              <TableCell align="left">Last Name</TableCell>
              <TableCell align="right">Job Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map each task from the backend to a row in the table */}
            {freeUsers.map((row) => (
              <TableRow
                key={row.PersonID}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="left">{row.FirstName}</TableCell>
                <TableCell align="left">{row.LastName}</TableCell>
                <TableCell align="right">{row.JobRole}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br/>
      <Typography>The most productive person is {bestUser.FirstName} {bestUser.LastName} with a total of {bestUser.TasksCompleted} tasks completed.</Typography>
    </>
  );
}
