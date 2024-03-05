"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_model_1 = __importDefault(require("../models/tasks.model"));
const application_error_1 = __importDefault(require("../errors/application.error"));
class TasksController {
    static async newTask(req, res, next) {
        try {
            const task = req.body;
            const newTask = await tasks_model_1.default.addTask(task);
            res.status(201).json({ success: true, task: newTask });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteTask(req, res, next) {
        try {
            const taskId = parseInt(req.params.taskId);
            const result = await tasks_model_1.default.deleteTask(taskId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserTasks(req, res, next) {
        try {
            const userId = parseInt(req.params.user_id);
            if (isNaN(userId)) {
                throw new application_error_1.default('Invalid user ID', 400);
            }
            const tasks = await tasks_model_1.default.getUserTasks(userId);
            res.status(200).json({ success: true, tasks });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateTask(req, res, next) {
        try {
            const taskId = parseInt(req.params.taskId);
            if (isNaN(taskId)) {
                throw new application_error_1.default('Invalid task ID', 400);
            }
            const taskUpdateInfo = req.body;
            const result = await tasks_model_1.default.updateTask(taskId, taskUpdateInfo);
            res.status(200).json({ success: true, message: 'Task updated successfully', result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = TasksController;
