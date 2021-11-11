// Import React stuff
import React, { useState, useEffect } from "react";

// Import utilites and components
import api from "../../utils/api";
import useStore from "../../utils/stores"
import Bar from "../../components/Bar/Bar";

// Import icons from mui
import AddIcon from '@mui/icons-material/AddCircle';
import FilterIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// Import general mui stuff
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, IconButton, Tooltip } from "@mui/material";

// Import dialog stuff from mui
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem } from "@mui/material";
import { FormControl, InputLabel } from "@mui/material";

// Import date picker and localization
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

// Setup a general format for dates
const dateFormatOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }

// Create a component for the table of tasks
// TODO: Move this to its own file
function TaskTable({ rows, projects, people, taskUpdate }) {

  // Grab the selected person piece of state so it can later be passed to the taskUpdate function
  const selectedPerson = useStore(state => state.selectedPerson)

  // Create relevant pieces of state for the dialog popup
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState({})

  // Create pieces of state for handling task updates
  const [updateComplete, setUpdateComplete] = useState(false)
  const [updateTitle, setUpdateTitle] = useState("")
  const [updateDueDate, setUpdateDueDate] = useState(new Date())
  const [updateProject, setUpdateProject] = useState(-1)
  const [updatePerson, setUpdatePerson] = useState(selectedPerson.personID)

  const [creationDate, setCreationDate] = useState(new Date())
  const [taskID, setTaskID] = useState(-1)

  // Handle when a row is clicked and set up the pieces of state 
  const handleRowClick = (event, task) => {
    console.log(task);
    setSelectedTask(task)
    setUpdateComplete(Boolean(task.Completion))
    setUpdateTitle(task.Title)
    setUpdateDueDate(new Date(task.DueDate * 1000))
    setUpdateProject(task.ProjectID)
    setUpdatePerson(task.PersonID != null ? task.PersonID : -1)
    setIsModifyDialogOpen(true)
    setCreationDate(task.CreationDate)
    setTaskID(task.TaskID)
    console.log(`Opening modification window for task id: ${task.TaskID}`)
  }

  // Functions to handle changes in values for modification dialog
  const handleUpdateCompleteChange = (event) => {
    setUpdateComplete(event.target.checked)
  }
  const handleUpdateTitleChange = (event) => {
    setUpdateTitle(event.target.value)
  }
  const handleUpdateDateChange = (newDate) => {
    setUpdateDueDate(newDate)
  }
  const handleUpdateProjectChange = (event) => {
    setUpdateProject(event.target.value)
  }
  const handleUpdatePersonChange = (event) => {
    setUpdatePerson(event.target.value)
  }

  const handleClose = () => {
    setIsModifyDialogOpen(false)
  }

  // Handle database update on submission of the dialog
  const handleSubmit = () => {
    setIsModifyDialogOpen(false)

    // Create the new updated task object
    // TODO: Consider only passing information that was actually modified
    const updatedTask = {
      title: updateTitle,
      completion: updateComplete,
      dueDate: updateDueDate.getTime() / 1000,
      projectID: updateProject,
      creationDate: creationDate,
      taskID: taskID
    }

    // Make a call to the backend api to update the task
    // TODO: Check for an error response here
    api.put(`/api/tasks/${updatedTask.taskID}`, updatedTask)
    .then(response => {
      taskUpdate(selectedPerson)
    })
  }

  // Handle when the delete button is pressed for a selected task
  // TODO: Add deletion confirmation
  const handleDelete = () => {
    setIsModifyDialogOpen(false)

    // Make the call to the backend to delete the selected task
    api.delete(`/api/tasks/delete/${taskID}`)
      .then(response => {
        taskUpdate(selectedPerson)
      })
  }

  const handleCompletion = (event, taskToComplete) => {

    // Suppress opening of the dialog box when the checkbox is clicked
    // TODO: Consider a better way to do this
    setIsModifyDialogOpen(false)

    const updatedTask = {
      completion: event.target.checked,
      taskID: taskToComplete
    }

    api.put(`/api/task/complete/${updatedTask.taskID}`, updatedTask)
      .then(response => {
        taskUpdate(selectedPerson)
      })
  }

  // TODO: Add spinner/message when rows is empty array
  return (
    <>
      {/* Build the task table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="User's Tasks">

          {/* Generate the headers of the rows */}
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Project</TableCell>
              <TableCell align="right">Due</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map each task from the backend to a row in the table */}
            {rows.map((row) => (
              <TableRow
                key={row.TaskID}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                onClick={(event) => handleRowClick(event, row)}
                hover
              >
                <TableCell padding="checkbox">
                  <Tooltip title={Boolean(row.Completion) ? "Mark Incomplete" : "Mark Complete"}>
                    <Checkbox testattr="Hello" color="primary" icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckIcon />} checked={Boolean(row.Completion)} onChange={(event) => handleCompletion(event, row.TaskID)}/>
                  </Tooltip>
                </TableCell>
                <TableCell>{row.Title}</TableCell>
                <TableCell align="right" size="small">{row.ProjectID === -1 ? "None" : row.ProjectTitle}</TableCell>
                <TableCell align="right" size="small">{new Date(row.DueDate * 1000).toLocaleDateString("en-US", dateFormatOptions)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* The popup dialog for editing and deleting tasks */}
      <Dialog open={isModifyDialogOpen} onClose={handleClose}>
        <DialogTitle>
          <Tooltip title={updateComplete ? "Mark Incomplete" : "Mark Complete"}>
            <Checkbox color="primary" icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckIcon />} checked={updateComplete} onChange={handleUpdateCompleteChange} margin='normal'/>
          </Tooltip>
          Modify task "{selectedTask.Title}"
        </DialogTitle>
        <DialogContent>
          {/* TODO: Limit how long these strings are so they don't break the database */}
          <TextField autoFocus id="Title" label="Title" type="text" fullWidth variant="outlined" margin="normal" onChange={handleUpdateTitleChange} value={updateTitle}/>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker label="Due Date" inputFormat="MM/dd/yyyy" renderInput={(params) => <TextField margin="normal" {...params}/>} onChange={handleUpdateDateChange} value={updateDueDate}/>
          </LocalizationProvider>
          <FormControl sx={{ m: 2, minWidth: 120 }}>
            <InputLabel id='project-select'>Project</InputLabel>
            <Select labelId="project-select-label" id="project-select" label="Project" value={updateProject} onChange={handleUpdateProjectChange}>
              <MenuItem value={-1}>None</MenuItem>
              {projects.map((row) => (
                <MenuItem key={row.ProjectID} value={row.ProjectID}>{row.Title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* TODO: Enable this for reassigning tasks. It  will take a custom query to change multiple tables. */}
          {/* <FormControl sx={{ m: 2, minWidth: 200 }}>
            <InputLabel id='assignee-select'>Assignee</InputLabel>
            <Select labelId="assignee-select-label" id="assignee-select" value={updatePerson} label="Person" onChange={handleUpdatePersonChange}>
              <MenuItem value={-1}>None</MenuItem>
              {people.map((row) => (
                <MenuItem key={row.PersonID} value={row.PersonID}>{row.FirstName + " " + row.LastName}</MenuItem>
              ))}
            </Select>
          </FormControl> */}
        </DialogContent>

        {/* Generate the buttons to act as actions on the dialog popup */}
        <DialogActions>
          <Button onClick={handleDelete} color="error">Delete Task</Button>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

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

    // Reset new task attributes back to default
    // TODO: Move this to a method
    setNewTaskProject(defaultNewProjectID)
    setNewTaskPerson(selectedPerson.personID)
    setNewTaskTitle(defaultNewTitle)
    setNewTaskDate(defaultNewDate)
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
    // TODO: Check for an error response here
    api.post(`/api/tasks`, newTask)
      .then(response => {
        updateTasks(selectedPerson)
      })
    
    // Set states for task attributes back to default
    // TODO: Move this to a method
    setNewTaskProject(defaultNewProjectID)
    setNewTaskTitle(defaultNewTitle)
    setNewTaskDate(defaultNewDate)
    setNewTaskPerson(selectedPerson.personID)
    
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

  // Make a call to the backend to update the list of projeccts
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

  // Make a call to the backend to update the list of projeccts
  // TODO: Call this incrementally
  const updatePeople = () => {
    api.get(`/api/people`)
    .then(response => {
      // TODO: Check response for error
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

      {/* Include the TaskTable component here. This component is defined above */}
      <TaskTable rows={tasks} projects={projects} people={people} taskUpdate={updateTasks}/>

      {/* Create the dialog box that will pop up when the Add button is pressed. This will add a new task to the database */}
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
