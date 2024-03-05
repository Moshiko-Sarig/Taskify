"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tasks_controllers_1 = __importDefault(require("../controllers/tasks.controllers"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.get('/get-user-tasks/:user_id', tasks_controllers_1.default.getUserTasks);
router.post('/add-new-task', tasks_controllers_1.default.newTask);
router.delete('/delete-task/:taskId', auth_1.default, tasks_controllers_1.default.deleteTask);
router.patch('/update-task/:taskId', tasks_controllers_1.default.updateTask);
exports.default = router;
