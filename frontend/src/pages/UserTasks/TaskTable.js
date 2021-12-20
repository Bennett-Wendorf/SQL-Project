// Import React stuff
import React, { useState, useEffect } from "react";

// Import utilites and components
import api from "../../utils/api";
import useStore from "../../utils/stores"

// Import icons from mui
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// Import general mui stuff
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, Tooltip } from '@mui/material';

// Import dialog stuff from mui
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem } from "@mui/material";
import { FormControl, InputLabel } from "@mui/material";

// Import date picker and localization
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import { makeStyles } from "@mui/styles";

// Setup a general format for dates
// TODO: Does this need to be accessible anywhere else?
const dateFormatOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }

// Generate some themeing for this component
const useStyles = makeStyles((theme) => ({
  editDialogAssignee: {
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
  }
}));

// Create a component for the table of tasks
export function TaskTable({ rows, projects, people, taskUpdate }) {

    const classes = useStyles()
  
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
        taskID: taskID,
        personID: updatePerson
      }
  
      // Make a call to the backend api to update the task
      // BUG: Check for an error response here
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
                      <Checkbox color="primary" icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckIcon />} checked={Boolean(row.Completion)} onChange={(event) => handleCompletion(event, row.TaskID)}/>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{row.Title}</TableCell>
                  <TableCell align="right" size="small">{row.ProjectID === -1 ? "None" : row.ProjectTitle}</TableCell>
                  {/* TODO: Turn this date red if the date has passed */}
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
            <TextField autoFocus id="Title" label="Title" type="text" fullWidth variant="outlined" margin="normal" onChange={handleUpdateTitleChange} value={updateTitle} inputProps={{maxLength: 100}} helperText={`${updateTitle.length}/100`}/>
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
            <FormControl sx={{ minWidth: 200 }} className={classes.editDialogAssignee}>
              <InputLabel id='assignee-select'>Assignee</InputLabel>
              <Select labelId="assignee-select-label" id="assignee-select" value={updatePerson} label="Person" onChange={handleUpdatePersonChange}>
                <MenuItem value={-1}>None</MenuItem>
                {people.map((row) => (
                  <MenuItem key={row.PersonID} value={row.PersonID}>{row.FirstName + " " + row.LastName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* TODO: Add label for when task was last assigned */}
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