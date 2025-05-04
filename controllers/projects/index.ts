import { Request, Response } from "express";
import { Project } from "../../models/project";
import { handleErrors } from "../../middlewares/errorHandler";

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ success: false, error: errors });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: project });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ success: false, error: errors });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ success: false, error: errors });
  }
};

export const getProjects = async (_: Request, res: Response) => {
  try {
    const projects = await Project.find();
    res.json({ success: true, data: projects });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ success: false, error: errors });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json({ success: true, data: project });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ success: false, error: errors });
  }
};
