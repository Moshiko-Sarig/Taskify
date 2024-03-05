import { NextFunction, Request, Response } from 'express';
import tasksModel from '../models/tasks.model';
import ApplicationError from '../errors/application.error';


class TasksController {

    static async newTask(req: Request, res: Response, next: NextFunction,) {
        try {
            const task = req.body;
            const newTask = await tasksModel.addTask(task);
            res.status(201).json({ success: true, task: newTask });
        }
        catch (error) {
            next(error)
        }
    }
    static async deleteTask(req: Request, res: Response, next: NextFunction) {
        try {
            const taskId = parseInt(req.params.taskId);
            const result = await tasksModel.deleteTask(taskId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    static async getUserTasks(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = parseInt(req.params.user_id);
            if (isNaN(userId)) {
                throw new ApplicationError('Invalid user ID', 400);
            }
            const tasks = await tasksModel.getUserTasks(userId);
            res.status(200).json({ success: true, tasks });
        } catch (error) {
            next(error);
        }
    }

    static async updateTask(req: Request, res: Response, next: NextFunction) {
        try {
            const taskId = parseInt(req.params.taskId);
            if (isNaN(taskId)) {
                throw new ApplicationError('Invalid task ID', 400);
            }
            const taskUpdateInfo = req.body;
            const result = await tasksModel.updateTask(taskId, taskUpdateInfo);
            res.status(200).json({ success: true, message: 'Task updated successfully', result });
        } catch (error) {
            next(error);
        }
    }


}


export default TasksController;