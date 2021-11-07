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
import { FormControl, InputLabel } from "@mui/material";

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

const dateFormatOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }

function TaskTable({ rows }) {

  // TODO: Look into datagrid instead of table
  // TODO: Add spinner/message when rows is empty array
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
              {/* TODO: Handle projectID's of -1 */}
              <TableCell align="right" size="small">{row.ProjectTitle}</TableCell>
              <TableCell align="right" size="small">{new Date(row.DueDate * 1000).toLocaleDateString("en-US", dateFormatOptions)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

// Define this component
export function UserTasks() {

  const defaultNewProjectID = -1
  const defaultNewTitle = ""
  const defaultNewDate = new Date()

  // Define a piece of state to use to store information from the api call
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTaskProjectID, setNewTaskProject] = useState(defaultNewProjectID)
  const [newTaskTitle, setNewTaskTitle] = useState(defaultNewTitle)
  const [newTaskDate, setNewTaskDate] = useState(defaultNewDate) // This will default to today
  const selectedPerson = useStore(state => state.selectedPerson)

  const handleClickOpen = () => {
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    updateTasks(selectedPerson)

    // Reset new task attributes back to default
    setNewTaskProject(defaultNewProjectID)
    setNewTaskTitle(defaultNewTitle)
    setNewTaskDate(defaultNewDate)
  }

  const handleNewTitleChange = (event) => {
    setNewTaskTitle(event.target.value)
  }

  const handleNewDateChange = (newDate) => {
    setNewTaskDate(newDate)
    console.log(newTaskDate);
  }

  const handleProjectSelectChange = (event) => {
    setNewTaskProject(event.target.value)
  }

  // Create a new task in the database and ensure data on the frontend is up to date
  const handleSubmit = (title, date, project) => {
    setIsDialogOpen(false)

    // TODO: Assign this new task to the selected person
    const newTask = {
      title: title,
      completion: false,
      dueDate: date,
      creationDate: new Date(),
      projectID: project,
      assignee: selectedPerson.personID
    }

    console.log(newTask);

    api.post(`/api/tasks`, newTask)
      .then(response => {
        console.log(response);
        updateTasks(selectedPerson)
      })
    
    // Set states for task attributes back to default
    setNewTaskProject(defaultNewProjectID)
    setNewTaskTitle(defaultNewTitle)
    setNewTaskDate(defaultNewDate)

  }

  // Make an api call to the backend to update the list of tasks
  // TODO: Call this incrementally
  const updateTasks = (sp) => {
    api.get(`/api/tasks/person/${sp.personID}`)
    .then(response => {
      // TODO: Check response for error
      setTasks(response.data ? response.data.rows : [])
      console.log("Updating tasks");
    })
    .catch(err => console.log(err))
  }

  // TODO: Call this incrementally
  const updateProjects = () => {
    api.get(`/api/projects`)
    .then(response => {
      // TODO: Check response for error
      setProjects(response.data ? response.data.rows : [])
      console.log("Updating projects");
    })
    .catch(err => console.log(err))
  }

  // The first time this component renders, update the Tasks
  useEffect(() => {
    updateProjects()
    updateTasks(selectedPerson)
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
      {/* TODO: Update tasks right away to that array only holds the data I need */}
      <TaskTable rows={tasks} />
      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>Add a New Task</DialogTitle>
        <DialogContent>
          {/* TODO: Limit how long these strings are so they don't break the database */}
          <TextField autoFocus id="Title" label="Title" type="text" fullWidth variant="outlined" margin="normal" onChange={handleNewTitleChange} value={newTaskTitle}/>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker label="Due Date" inputFormat="MM/dd/yyyy" value={newTaskDate} onChange={handleNewDateChange} renderInput={(params) => <TextField margin="normal" {...params}/>} />
          </LocalizationProvider>
          <FormControl sx={{ m: 2, minWidth: 120 }}>
            <InputLabel id='project-select'>Project</InputLabel>
            <Select labelId="project-select-label" id="project-select" value={newTaskProjectID} label="Project" onChange={handleProjectSelectChange}>
              <MenuItem value={-1}>None</MenuItem>
              {projects.map((row) => (
                <MenuItem key={row.ProjectID} value={row.ProjectID}>{row.Title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleSubmit(newTaskTitle, newTaskDate, newTaskProjectID)}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
