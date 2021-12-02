
/*******************************************************************************
   Task Database - Version 1
   Script: TaskDatabase.sql
   Description: Creates and populates the Task database.
   DB Server: Sqlite
   Author: Connor Marks and Bennett Wendorf
********************************************************************************/



/*******************************************************************************
   Create Tables
********************************************************************************/
CREATE TABLE Project (
    ProjectID INTEGER PRIMARY KEY AUTOINCREMENT,
    Title NVARCHAR(24) NOT NULL,
    DueDate INTEGER NOT NULL
);

CREATE TABLE Task (
    TaskID INTEGER PRIMARY KEY AUTOINCREMENT,
    Title NVARCHAR(24) NOT NULL,
    Completion BOOLEAN NOT NULL,
    DueDate INTEGER NOT NULL,
    CreationDate INTEGER NOT NULL,
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
    DateAssigned INTEGER NOT NULL,
    TaskID INTEGER NOT NULL,
    PersonID INTEGER NOT NULL,
    CONSTRAINT fk_taskID_completes FOREIGN KEY (TaskID) REFERENCES Task(TaskID),
    CONSTRAINT fk_PersonID_completes FOREIGN KEY (PersonID) REFERENCES Person(PersonID)
);

/*******************************************************************************
   Populate Tables
********************************************************************************/
-- Project --
INSERT INTO Project (Title, DueDate) VALUES ('Rebrand', 1640239200); /* December 23rd 2021 */
INSERT INTO Project (Title, DueDate) VALUES ('Accounting Software', 1640930400); /* December 31st 2021 */
INSERT INTO Project (Title, DueDate) VALUES ('New Website', 1642658400); /* January 20th, 2022 */
INSERT INTO Project (Title, DueDate) VALUES ('Most Secretest Project', 1644645600); /* February 12th, 2022 */

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
INSERT INTO Person (FirstName, LastName, JobRole) VALUES ('Jimmy', 'Jenkins', 'Developer');

-- Rebrand Tasks --
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Rebrand Budget', TRUE, 1639980000, 1611727200, 1); /* December 20th 2021, January 27th 2021 */
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('New Logo', FALSE, 1640066400, 1611813600, 1); /* December 21st 2021, January 28th 2021 */
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Update Companies Apps', FALSE, 1640066400, 1611900000, 1); /* December 21st 2021, January 29th 2021 */

-- Accounting Software Tasks --
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Implementation', FALSE, 1640152800, 1611986400, 2); /* December 22nd 2021, January 30th 2021 */
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Research', FALSE, 1640239200, 1611986400, 2); /* December 23rd 2021, January 30th 2021 */
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Software Budget', TRUE, 1640930400, 1609480800, 2); /* December 31st 2021, January 31st 2021 */

-- Most Secretest Project Tasks --
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Build secret database', TRUE, 1637474400, 1637301600, 4); /* November 21st 2021, November 19th 2021 */
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Talk to designers about secret design stuff', FALSE, 1637733600, 1637301600, 4); /* November 24th 2021, November 19th 2021 */
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Talk to IT about secret server stuff', FALSE, 1639116000, 1637301600, 4); /* December 10th 2021, November 19th 2021 */
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Get secret prototypes from manufacturer', TRUE, 1640930400, 1637301600, 4); /* December 31st 2021, November 19th 2021 */

-- Projectless Tasks --
INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES ('Replace supply closet lightbulb', FALSE, 1637301600, 1636696800, -1); /* November 19th 2021, November 12th 2021 */

-- Houses --
INSERT INTO Houses (ProjectID, DeptID) VALUES (1, 1);
INSERT INTO Houses (ProjectID, DeptID) VALUES (1, 2);
INSERT INTO Houses (ProjectID, DeptID) VALUES (1, 3);
INSERT INTO Houses (ProjectID, DeptID) VALUES (1, 4);

INSERT INTO Houses (ProjectID, DeptID) VALUES (2, 2);
INSERT INTO Houses (ProjectID, DeptID) VALUES (2, 3);
INSERT INTO Houses (ProjectID, DeptID) VALUES (2, 4);

INSERT INTO Houses(ProjectID, DeptID) VALUES (4, 3);

-- Completes --
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES (1622091600, 1, 4); /* May 27th, 2021*/
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES (1622178000, 2, 3); /* May 28th, 2021*/
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES (1622264400, 3, 1); /* May 29th, 2021*/
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES (1622350800, 4, 3); /* May 30th, 2021*/
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES (1622437200, 6, 4); /* May 31st, 2021*/
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES (1637301600, 7, 2); /* November 19th, 2021*/
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES (1637388000, 8, 3); /* November 20th, 2021*/
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES (1638338400, 9, 1); /* December 1st, 2021*/
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES (1638511200, 10, 4); /* December 3rd, 2021*/
INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES (1636956000, 11, 2); /* November 15th, 2021*/