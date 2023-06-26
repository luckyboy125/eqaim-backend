import express from "express";
import AddController from "../controllers/add.controller";

export const addRouter = express.Router();

const addController = new AddController();

addRouter.post("/", addController.add);

addRouter.post("/save", addController.saveSteps);
