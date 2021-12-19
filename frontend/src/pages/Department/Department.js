import React, { useState, useEffect } from "react";
import Bar from "../../components/Bar/Bar";

// Import general mui stuff
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar } from "@mui/material";

import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

// Import utilites and components
import api from "../../utils/api";

// Create the manage page component
export function Department() {

  const [departments, setDepartments] = useState([])
  const [departmentSelect, setDepartmentSelect] = useState(1)
  const [departmentPeople, setDepartmentPeople] = useState([])


  const handleDeptSelectChange = (event) => {
    setDepartmentSelect(event.target.value)
    updateDepartmentPeople(event.target.value)
  }

  // TODO: update this incrementally
  const updateDepartments = () => {
    api.get('/api/departments')
      .then(response => {
        setDepartments(response.data ? response.data.rows : [])
        console.log("Updating departments")
      })
      .catch(err => console.log(err))
  }

  const updateDepartmentPeople = (sd) => {
    api.get(`/api/people/department/${sd}`)
    .then(response => {
      setDepartmentPeople(response.data ? response.data.rows : [])
      console.log("Updating department people");
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    updateDepartments()
    updateDepartmentPeople(departmentSelect)
  }, [])

  return (
    <>
      <Bar title="Department">
        <FormControl sx={{ m: 2, minWidth: 120 }} justify="left">
          <InputLabel id="dept-select-label">Department</InputLabel>
          <Select labelId="dept-select-label" id="dept-select" label="Department" value={departmentSelect} onChange={handleDeptSelectChange}>
            {departments.map((row) => (
              <MenuItem key={row.DeptID} value={row.DeptID}>{row.DeptName}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Bar>
      <Toolbar>Employees</Toolbar>
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
            {departmentPeople.map((row) => (
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
    </>
  );
}
