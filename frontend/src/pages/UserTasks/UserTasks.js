import React, { useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { consoleCleared, consoleLogAdded } from "../../app/slices/consoleSlice";

import "./UserTasks.css";
import api from "../../utils/api";

import Button from '@mui/material/Button';

const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

const ServerConsole = () => {
  const [consoleInput, setConsoleInput] = useState("");
  const consoleLogs = useSelector((state) => state.console.logs);
  const minecraftServerState = useSelector(
    (state) => state.minecraftServer.status
  );

  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setConsoleInput(event.target.value);
  };

  const handleEnterPress = (event) => {
    if (event.keyCode === 13) sendCommand(consoleInput);
  };

  const sendCommand = (consoleInput) => {
    const command = JSON.stringify({ command: consoleInput });

    api.post("/server/command", command).catch((err) => console.log(err));

    dispatch(consoleLogAdded([":> " + consoleInput]));
    setConsoleInput("");
  };

  return (
    <div className="console">
      <div className="consoleOutput" id="style-2">
        {consoleLogs.map((log, j) => (
          <p key={j}>{log}</p>
        ))}
        <AlwaysScrollToBottom />
      </div>
      <input
        disabled={minecraftServerState === "SERVER_RUNNING" ? false : true}
        type="text"
        id="console-input"
        name="console-input"
        placeholder="Enter in a command"
        onChange={handleInputChange}
        onKeyDown={handleEnterPress}
        value={consoleInput}
      ></input>
    </div>
  );
};

export function UserTasks() {
  const dispatch = useDispatch();

  const [firstTask, setFirstTask] = useState({})

  useEffect(() => api.get('/api/tasks')
    .then(response => { 
      setFirstTask(response)
    })
    .catch(err => console.log(err)), [])

  return (
    <div>
      <label>{firstTask['data'] ? firstTask['data']['data'][0]['Title'] : ""}</label>
      <br/>
      <label>{firstTask['data'] ? firstTask['data']['data'][1]['Title'] : ""}</label>
      <br/>
      <label>{firstTask['data'] ? firstTask['data']['data'][2]['Title'] : ""}</label>
    </div>
  );
}
