"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const application_error_1 = __importDefault(require("../errors/application.error"));
function errorHandler(err, req, res, next) {
    if (err instanceof application_error_1.default) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err); //? Log unexpected errors for debugging
    return res.status(500).json({ error: 'Internal Server Error' });
}
exports.errorHandler = errorHandler;
