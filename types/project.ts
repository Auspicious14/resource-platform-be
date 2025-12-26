import { Difficulty, DifficultyMode, ProjectStatus } from "@prisma/client";

export interface IProject {
  id: string;
  title: string;
  description: string;
  difficultyLevel: Difficulty;
  technologies: string[];
  categories: string[];
  estimatedTime?: string;
  learningObjectives: string[];
  resourceLinks: any[];
  starterRepoUrl?: string;
  difficultyModes: DifficultyMode[];
  submissionCount: number;
  completionRate: number;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  milestones?: IProjectMilestone[];
  progressByMode?: Record<string, any>;
  userProgress?: any;
}

export interface IProjectMilestone {
  id: string;
  projectId: string;
  milestoneNumber: number;
  title: string;
  description: string;
  hints: string[];
  validationCriteria?: string;
}

export interface IUserProject {
  id: string;
  userId: string;
  projectId: string;
  status: ProjectStatus;
  difficultyModeChosen: DifficultyMode;
  repoUrl?: string;
  startedAt: Date;
  completedAt?: Date;
}
