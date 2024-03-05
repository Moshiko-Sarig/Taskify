import express, { Router } from "express";
import TasksController from "../controllers/tasks.controllers";
import authenticateUser from "../middlewares/auth";
const router: Router = express.Router();

router.get('/get-user-tasks/:user_id', TasksController.getUserTasks);
router.post('/add-new-task', TasksController.newTask);
router.delete('/delete-task/:taskId',authenticateUser, TasksController.deleteTask);
router.patch('/update-task/:taskId',  TasksController.updateTask);

export default router;