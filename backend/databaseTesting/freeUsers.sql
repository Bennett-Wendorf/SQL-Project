--Get users whose tasks are all completed
SELECT PersonID, FirstName, LastName, JobRole
FROM (SELECT PersonID, FirstName, LastName, JobRole, Task.Completion
    FROM Person NATURAL JOIN Completes NATURAL JOIN Task
    GROUP BY PersonID, Completion
    ORDER BY Completion ASC)
GROUP BY PersonID
HAVING Completion = 1;

--Get users that have no tasks assigned
SELECT PersonID, FirstName, LastName, JobRole
FROM Person NATURAL LEFT JOIN Completes
WHERE TaskID IS NULL;