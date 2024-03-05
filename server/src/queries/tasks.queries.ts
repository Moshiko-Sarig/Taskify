const tasksQueries = {
    ADD_NEW_TASK: `
        INSERT INTO tasks 
        (user_id, title, description, due_date, status, priority, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,

        UPDATE_TASK: `
        UPDATE \`tasks\`
        SET title = ?, description = ?, due_date = ?, status = ?, priority = ?, updated_at = ?
        WHERE task_id = ?
    `,
    
    DELETE_TASK: `DELETE FROM \`tasks\` WHERE task_id = ?`,

    GET_TASKS_BY_USER_ID: `SELECT * FROM \`tasks\` WHERE user_id = ?`,

};

export default tasksQueries;