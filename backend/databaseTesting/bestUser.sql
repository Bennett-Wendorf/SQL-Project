SELECT PersonID, FirstName, LastName, JobRole, Max(CompletedTasks) AS TasksCompleted
FROM (SELECT PersonID, FirstName, LastName, JobRole, Count(*) AS CompletedTasks
    FROM Person NATURAL JOIN Completes NATURAL JOIN Task
    WHERE Completion = 1
    GROUP BY PersonID)