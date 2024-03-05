"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPriority = exports.TaskStatus = void 0;
const db_1 = require("../database/db");
const application_error_1 = __importDefault(require("../errors/application.error"));
const tasks_queries_1 = __importDefault(require("../queries/tasks.queries"));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["NotStarted"] = "Not Started";
    TaskStatus["InProgress"] = "In Progress";
    TaskStatus["Completed"] = "Completed";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["Low"] = "Low";
    TaskPriority["Medium"] = "Medium";
    TaskPriority["High"] = "High";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
class tasksModel {
    static async addTask(task) {
        try {
            const currentTime = new Date();
            const newTask = await (0, db_1.executeQueryAsync)(tasks_queries_1.default.ADD_NEW_TASK, [
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
            throw new application_error_1.default('Failed to add new task', 500);
        }
    }
    static async deleteTask(taskId) {
        try {
            await (0, db_1.executeQueryAsync)(tasks_queries_1.default.DELETE_TASK, [taskId]);
            return { success: true, message: 'Task successfully deleted.' };
        }
        catch (error) {
            throw new application_error_1.default('Failed to delete task', 500);
        }
    }
    static async getUserTasks(user_id) {
        try {
            const tasks = await (0, db_1.executeQueryAsync)(tasks_queries_1.default.GET_TASKS_BY_USER_ID, [user_id]);
            return tasks;
        }
        catch (error) {
            throw new application_error_1.default('Failed to load tasks', 500);
        }
    }
    static async updateTask(taskId, taskUpdateInfo) {
        try {
            const { title, description, due_date, status, priority } = taskUpdateInfo;
            const currentTime = new Date();
            const result = await (0, db_1.executeQueryAsync)(tasks_queries_1.default.UPDATE_TASK, [
                title,
                description,
                due_date,
                status,
                priority,
                currentTime,
                taskId,
            ]);
            return result;
        }
        catch (error) {
            console.error(error);
            throw new application_error_1.default('Failed to update task', 500);
        }
    }
}
exports.default = tasksModel;
