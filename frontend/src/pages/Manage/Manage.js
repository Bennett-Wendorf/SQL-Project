import React, { useState, useEffect } from "react";
import Bar from "../../components/Bar/Bar";

// Import general mui stuff
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Typography } from "@mui/material";

// Import utilites and components
import api from "../../utils/api";

// Create the manage page component
export function Manage() {

  const [freeUsers, setFreeUsers] = useState([])
  const [bestUser, setBestUser] = useState({})

  const updateFreeUsers = () => {
    api.get('/api/people/free')
      .then(response => {
        setFreeUsers(response.data ? response.data.rows : [])
        console.log("Updating free users")
      })
      .catch(err => console.log(err))
  }

  const updateBestUser = () => {
    api.get('/api/people/best')
      .then(response => {
        setBestUser(response.data ? response.data.rows[0] : {})
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
      <Bar title="Manage"/>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar>
          <Typography variant="h5">Free Users</Typography>
        </Toolbar>
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
      </Paper>
      {freeUsers.length <= 0 &&
        <Typography variant="h6" align="center" sx={{ marginTop: "10px"}}>There are no people to display here. :(</Typography>
      }
      <br/>
      {bestUser.PersonID &&
        <Typography>The most productive person is {bestUser.FirstName} {bestUser.LastName} with a total of {bestUser.CompletedTasks} tasks completed.</Typography>
      }
    </>
  );
}
