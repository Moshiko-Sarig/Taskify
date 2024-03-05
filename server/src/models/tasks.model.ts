import { executeQueryAsync } from "../database/db";
import ApplicationError from "../errors/application.error";
import tasksQueries from "../queries/tasks.queries";


export enum TaskStatus {
    NotStarted = 'Not Started',
    InProgress = 'In Progress',
    Completed = 'Completed'
}

export enum TaskPriority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}


export interface Task {
    task_id: number;
    user_id: number;
    title: string;
    description: string;
    due_date: string;
    status: TaskStatus;
    priority: TaskPriority;
    created_at: string;
    updated_at: string;
}

class tasksModel {

    static async addTask(task: Task) {
        try {
            const currentTime = new Date();
            const newTask = await executeQueryAsync(tasksQueries.ADD_NEW_TASK, [
                task.user_id,
                task.title,
                task.description,
                task.due_date,
                task.status,
                task.priority,
                currentTime,
                currentTime,
            ]);
            return newTask;
        }
        catch (error) {
            throw new ApplicationError('Failed to add new task', 500);
        }
    }
    static async deleteTask(taskId: number) {
        try {
            await executeQueryAsync(tasksQueries.DELETE_TASK, [taskId]);
            return { success: true, message: 'Task successfully deleted.' };
        } catch (error) {
            throw new ApplicationError('Failed to delete task', 500);
        }
    }

    static async getUserTasks(user_id: number) {
        try {
            const tasks = await executeQueryAsync(tasksQueries.GET_TASKS_BY_USER_ID, [user_id]);
            return tasks;
        } catch (error) {
            throw new ApplicationError('Failed to load tasks', 500);
        }
    }

    static async updateTask(taskId: number, taskUpdateInfo: any) {
        try { 
            const { title, description, due_date, status, priority } = taskUpdateInfo;
            const currentTime = new Date(); 
            const result = await executeQueryAsync(tasksQueries.UPDATE_TASK, [
                title, 
                description, 
                due_date, 
                status, 
                priority, 
                currentTime,
                taskId,
            ]);
            return result;
        } catch (error) {
            console.error(error); 
            throw new ApplicationError('Failed to update task', 500);
        }
    }
}

export default tasksModel;