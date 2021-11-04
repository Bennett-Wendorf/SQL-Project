// Import React stuff
import React, { useState, useEffect } from "react";

// Import css and api
import "./UserTasks.css";

import api from "../../utils/api";
import useStore from "../../utils/stores"
import Bar from "../../components/Bar/Bar";
import { Button, IconButton, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/AddCircle';
import FilterIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from "@mui/material";

import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem } from "@mui/material";

function TaskTable({ rows }) {

  // TODO: Look into datagrid instead of table
  // TODO: Add spinner when rows is empty array
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="User's Tasks">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Title</TableCell>
            <TableCell align="right">Project</TableCell>
            <TableCell align="right">Due</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.TaskID}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell padding="checkbox">
                <Tooltip title="Mark Complete">
                  <Checkbox color="primary" icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckIcon />}/>
                </Tooltip>
              </TableCell>
              <TableCell>{row.Title}</TableCell>
              <TableCell align="right" size="small">{row.ProjectTitle}</TableCell>
              <TableCell align="right" size="small">{row.DueDate}</TableCell>
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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTaskProject, setNewTaskProject] = useState(-1) // TODO: Make this default to something more sensible
  const selectedPerson = useStore(state => state.selectedPerson)

  const handleClickOpen = () => {
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    updateTasks(selectedPerson)
  }

  // TODO Create a new task in the database and ensure data on the frontend is up to date
  const handleSubmit = () => {
    setIsDialogOpen(false)
    api.get('/api/tasks')
    .then(response => {
      setTasks(response)
    })
    .catch(err => console.log(err))
  }

  const handleProjectSelectChange = (event) => {
    setNewTaskProject(event.target.value)
  }

  // Make an api call to the backend to update the list of tasks
  // TODO: Call this incrementally
  const updateTasks = (sp) => {
    api.get(`/api/tasks/person/${sp.personID}`)
    .then(response => {
      // TODO: Check response for error
      setTasks(response)
      console.log("Updating tasks");
    })
    .catch(err => console.log(err))
  }

  // The first time this component renders, update the Tasks
  useEffect(() => {
    updateTasks(selectedPerson);
    const unsub1 = useStore.subscribe((state) => {
      updateTasks(state.selectedPerson)
    });
    return () => {
      unsub1()
    }
  }, [])

  // Return some JSX definine 3 labels with task data from the api call
  return (
    <div>
      <Bar title="User Tasks">
        <Tooltip title="Add" justify="left">
          <IconButton aria-label="add" size="large" onClick={handleClickOpen}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Sort" justify="right">
          <IconButton aria-label="sort" size="large">
            <SortIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Filter" justify="right">
          <IconButton aria-label="filter" size="large">
            <FilterIcon />
          </IconButton>
        </Tooltip>
      </Bar>
      {/* {BuildTable(tasks.data ? tasks.data.rows : [])} */}
      <TaskTable rows={tasks.data ? tasks.data.rows: []} />
      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>Add a New Task</DialogTitle>
        <DialogContent>
          {/* TODO: Limit how long these strings are so they don't break the database */}
          <TextField autoFocus id="Title" label="Title" type="text" fullWidth variant="outlined" margin="normal"/>
          <TextField id="Due" label="Due Date" type="date" InputLabelProps={{ shrink: true }} margin="normal"/>
          <Select labelId="project-select-label" id="project-select" value={newTaskProject} label="Project" onChange={handleProjectSelectChange}>
            {/* TODO Build this selection with list of projects */}
            <MenuItem value={-1}>None</MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
