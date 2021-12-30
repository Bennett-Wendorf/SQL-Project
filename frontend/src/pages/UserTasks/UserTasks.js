// Import React stuff
import React, { useState, useEffect } from "react";

// Import utilites and components
import api from "../../utils/api";
import useStore from "../../utils/stores"
import Bar from "../../components/Bar/Bar";
import { TaskTable } from './TaskTable'; 

// Import icons from mui
import AddIcon from '@mui/icons-material/AddCircle';

// Import general mui stuff
import { Button, IconButton, Tooltip } from "@mui/material";

// Import dialog stuff from mui
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem } from "@mui/material";
import { FormControl, InputLabel } from "@mui/material";

// Import date picker and localization
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

// Create a component for the UserTasks page
export function UserTasks() {

  // Define default values for new tasks
  const defaultNewProjectID = -1
  const defaultNewTitle = ""
  const defaultNewDate = new Date()

  // Define a piece of state to use to store information from the api call
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [people, setPeople] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTaskProjectID, setNewTaskProject] = useState(defaultNewProjectID)
  const [newTaskTitle, setNewTaskTitle] = useState(defaultNewTitle)
  const [newTaskDate, setNewTaskDate] = useState(defaultNewDate) // This will default to today
  const selectedPerson = useStore(state => state.selectedPerson)

  const [newTaskPersonID, setNewTaskPerson] = useState(selectedPerson.personID)

  // Handle opening and closing of the dialog for new tasks
  const handleClickOpen = () => {
    setIsDialogOpen(true)
  }
  const handleClose = () => {
    setIsDialogOpen(false)
    updateTasks(selectedPerson)

    resetNewTaskValues()
  }

  // Handle state changes for the new task dialog
  const handleNewTitleChange = (event) => {
    setNewTaskTitle(event.target.value)
  }
  const handleNewDateChange = (newDate) => {
    setNewTaskDate(newDate)
  }
  const handleProjectSelectChange = (event) => {
    setNewTaskProject(event.target.value)
  }

  const handlePersonSelectChange = (event) => {
    setNewTaskPerson(event.target.value)
  }

  // Set states for task attributes back to default
  const resetNewTaskValues = () => {
    setNewTaskProject(defaultNewProjectID)
    setNewTaskTitle(defaultNewTitle)
    setNewTaskDate(defaultNewDate)
    setNewTaskPerson(selectedPerson.personID)
  }

  // Create a new task in the database and ensure data on the frontend is up to date
  const handleSubmit = (title, date, project) => {
    setIsDialogOpen(false)

    // Generate an object with the information for the new task
    const newTask = {
      title: title,
      completion: false,
      // Convert the dates into unix timestamps
      dueDate: new Date(date).getTime() / 1000,
      creationDate: new Date().getTime() / 1000,
      projectID: project,
      assignee: newTaskPersonID
    }

    // Send a request to the backend to create a new task
    api.post(`/api/tasks`, newTask)
      .then(response => {
        updateTasks(selectedPerson)
      })

    resetNewTaskValues()
  }

  // Make an api call to the backend to update the list of tasks
  const updateTasks = (sp) => {
    api.get(`/api/tasks/person/${sp.personID}`)
    .then(response => {
      setTasks(response.data ? response.data.rows : [])
      console.log("Updating tasks");
    })
    .catch(err => console.log(err))
  }

  // Make a call to the backend to update the list of projeccts
  const updateProjects = () => {
    api.get(`/api/projects`)
    .then(response => {
      setProjects(response.data ? response.data.rows : [])
      console.log("Updating projects");
    })
    .catch(err => console.log(err))
  }

  // Make a call to the backend to update the list of people
  const updatePeople = () => {
    api.get(`/api/people`)
    .then(response => {
      setPeople(response.data ? response.data.rows : [])
      console.log("Updating people");
    })
    .catch(err => console.log(err))
  }

  // The first time this component renders, update the Tasks
  useEffect(() => {
    updateProjects()
    updatePeople()
    updateTasks(selectedPerson)
    const unsub1 = useStore.subscribe((state) => {
      updateTasks(state.selectedPerson)
    });
    return () => {
      unsub1()
    }
  }, [])

  // Build the User Tasks page
  return (
    <div>
      {/* Define the bar for the top of the screen, with its buttons */}
      <Bar title="User Tasks">
        <Tooltip title="Add" justify="left">
          <IconButton aria-label="add" size="large" onClick={handleClickOpen}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Bar>

      {/* Include the TaskTable component here. This component is defined above */}
      <TaskTable rows={tasks} projects={projects} people={people} taskUpdate={updateTasks}/>

      {/* Create the dialog box that will pop up when the Add button is pressed. This will add a new task to the database */}
      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>Add a New Task</DialogTitle>
        <DialogContent>
          <TextField autoFocus id="Title" label="Title" type="text" fullWidth variant="outlined" margin="normal" onChange={handleNewTitleChange} value={newTaskTitle} inputProps={{maxLength: 100}} helperText={`${newTaskTitle.length}/100`}/>
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
          <FormControl sx={{ m: 2, minWidth: 200 }}>
            <InputLabel id='assignee-select'>Assignee</InputLabel>
            <Select labelId="assignee-select-label" id="assignee-select" value={newTaskPersonID} label="Person" onChange={handlePersonSelectChange}>
              <MenuItem value={-1}>None</MenuItem>
              {people.map((row) => (
                <MenuItem key={row.PersonID} value={row.PersonID}>{row.FirstName + " " + row.LastName}</MenuItem>
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
