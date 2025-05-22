import { Request, Response } from "express";
import { Project } from "../../models/project";
import { handleErrors } from "../../middlewares/errorHandler";
import userAuth from "../../models/auth";

export const createProject = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  try {
    if (!userId)
      res.json({
        success: false,
        message: "Unauthenticated. Please Login to continue",
      });

    const user = await userAuth.findById(userId);
    if (user?._id.toString() !== userId)
      res.json({ success: false, message: "Unauthorised" });

    const fullName = `${user?.firstName} ${user?.lastName}`;
    const project = new Project({ ...req.body, author: fullName });
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

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { difficulty, title, description, requirements } = req.query;
    const filter: any = {};
    if (difficulty) filter.difficulty = difficulty;
    if (title) filter.title = { $regex: title, $options: "i" };
    if (description)
      filter.description = { $regex: description, $options: "i" };
    if (requirements) {
      const reqArr = Array.isArray(requirements)
        ? requirements
        : String(requirements)
            .split(",")
            .map((r) => r.trim());
      filter.requirements = { $in: reqArr };
    }
    const projects = await Project.find(filter);
    res.json({ success: true, data: projects });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ success: false, error: errors });
  }
};

export const getFeaturedProjects = async (_: Request, res: Response) => {
  try {
    const projects = await Project.find().limit(10);
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
