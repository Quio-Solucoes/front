export type ProjectStatus = "draft" | "in-progress" | "completed";

export type Project = {
  id: string;
  name: string;
  client?: string;
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
};

