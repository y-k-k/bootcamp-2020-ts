"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); /* const express = require("express"); */
const bodyParser = require("body-parser");
const todoRouter = require("./todo");
const app = express_1.default();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use("/todo", todoRouter);
app.listen(PORT);
