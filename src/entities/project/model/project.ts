export type ProjectStatus = "draft" | "in-progress" | "completed";

export type Project = {
  id: string;
  name: string;
  architect?: string;
  client?: string;
  environment?: string;
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
};

