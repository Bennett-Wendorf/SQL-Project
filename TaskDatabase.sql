
/*******************************************************************************
   Task Database - Version 1
   Script: TaskDatabase.sql
   Description: Creates and populates the Task database.
   DB Server: Sqlite
   Author: Connor Marks and Bennet Wendorf
********************************************************************************/



/*******************************************************************************
   Create Tables
********************************************************************************/
CREATE TABLE Project (
    ProjectID INTEGER PRIMARY KEY AUTOINCREMENT,
    Title NVARCHAR(24) NOT NULL,
    DueDate NVARCHAR(24) NOT NULL
);

CREATE TABLE Task (
    TaskID INTEGER PRIMARY KEY AUTOINCREMENT,
    Title NVARCHAR(24) NOT NULL,
    Completion BOOLEAN NOT NULL,
    DueDate NVARCHAR(24) NOT NULL,
    CreationDate NVARCHAR(24) NOT NULL,
    ProjectID INTEGER NOT NULL,
    CONSTRAINT fk_task_project FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)
);

CREATE TABLE Person (
    PersonID INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName NVARCHAR(24) NOT NULL,
    LastName NVARCHAR(24) NOT NULL,
    JobRole NVARCHAR(50) NOT NULL
);

CREATE TABLE Department (
    DeptID INTEGER PRIMARY KEY AUTOINCREMENT,
    DeptName NVARCHAR(24) NOT NULL
);

CREATE TABLE Houses (
    ProjectID INTEGER NOT NULL,
    DeptID INTEGER NOT NULL,
    CONSTRAINT fk_project_houses FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
    CONSTRAINT fk_department_houses FOREIGN KEY (DeptID) REFERENCES Department(DeptID)
);

CREATE TABLE Completes (
    DateAssigned NVARCHAR(24) NOT NULL,
    TaskID INTEGER NOT NULL,
    PersonID INTEGER NOT NULL,
    CONSTRAINT fk_taskID_completes FOREIGN KEY (TaskID) REFERENCES Task(TaskID),
    CONSTRAINT fk_PersonID_completes FOREIGN KEY (PersonID) REFERENCES Person(PersonID)
);

/*******************************************************************************
   Populate Tables
********************************************************************************/
-- Project --
INSERT INTO Project (Title, DueDate) VALUES ('Rebrand', 'December 2021');
INSERT INTO Project (Title, DueDate) VALUES ('Accounting Software', 'December 2021');

-- Department --
INSERT INTO Department (DeptName) VALUES ('Marketing');
INSERT INTO Department (DeptName) VALUES ('Accounting');
INSERT INTO Department (DeptName) VALUES ('Information Technology');
INSERT INTO Department (DeptName) VALUES ('Human Resource');
INSERT INTO Department (DeptName) VALUES ('R&D');

 -- People --
INSERT INTO Person (FirstName, LastName, JobRole) VALUES ('Joe', 'Johnson', 'Computer Engineer');
INSERT INTO Person (FirstName, LastName, JobRole) VALUES ('Sally', 'Peterson', 'IT Supervisor');
INSERT INTO Person (FirstName, LastName, JobRole) VALUES ('Jane', 'Doe', 'Digital Marketing Manager');
INSERT INTO Person (FirstName, LastName, JobRole) VALUES ('Andrew', 'Jones', 'Accountant');

--Rebrand Tasks--
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Rebrand Budget', FALSE, 'December 2021', 'January 2020', 1);
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('New Logo', FALSE, 'December 2021', 'January 2020', 1);
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Update Companies Apps', FALSE, 'December 2021', 'January 2020', 1);

--System Update Tasks--
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Implementation', FALSE, 'December 2021', 'January 2020', 2);
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Reasearch', FALSE, 'December 2021', 'January 2020', 2);
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Software Budget', FALSE, 'December 2021', 'January 2020', 2);

-- Houses --
INSERT INTO Houses (ProjectID, DeptID) VALUES (1, 1);
INSERT INTO Houses (ProjectID, DeptID) VALUES (1, 2);
INSERT INTO Houses (ProjectID, DeptID) VALUES (1, 3);
INSERT INTO Houses (ProjectID, DeptID) VALUES (1, 4);

INSERT INTO Houses (ProjectID, DeptID) VALUES (2, 2);
INSERT INTO Houses (ProjectID, DeptID) VALUES (2, 3);
INSERT INTO Houses (ProjectID, DeptID) VALUES (2, 4);

-- Completes --
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES ('January 2020', 1, 4);
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES ('January 2020', 2, 3);
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES ('January 2020', 3, 1);
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES ('January 2020', 4, 3);
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES ('January 2020', 6, 4);
