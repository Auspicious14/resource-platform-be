import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";

export const createTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, projectId } = req.body;
  const userId = (req as any).user?.id;

  try {
    const team = await prisma.team.create({
      data: {
        name,
        projectId,
        members: {
          create: {
            userId,
          },
        },
      },
      include: {
        members: true,
      },
    });

    res.status(201).json({ success: true, data: team });
  } catch (error: any) {
    next(error);
  }
};

export const joinTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: teamId } = req.params;
  const userId = (req as any).user?.id;

  try {
    const teamMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId,
      },
    });

    res.status(201).json({ success: true, data: teamMember });
  } catch (error: any) {
    next(error);
  }
};

export const getTeamProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: teamId } = req.params;

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        project: true,
      },
    });

    if (!team)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });

    res.json({ success: true, data: team.project });
  } catch (error: any) {
    next(error);
  }
};
