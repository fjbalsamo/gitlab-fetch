export interface ICommonGroup {
  id: string;
  name: string;
  fullName: string;
  path: string;
  fullPath: string;
  avatarUrl: null | string;
  description: string;
}

export interface ICommonPageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface SerializedGroup {
  id: number;
  avatarUrl: string | undefined;
  description: string;
  name: string;
  fullName: string;
  path: string;
}

export interface SerializedProject {
  id: number;
  name: string;
  fullPath: string;
  path: string;
  webUrl: string;
  sshUrlToRepo: string;
  httpUrlToRepo: string;
  description: null | string;
  avatarUrl?: string;
  languages: {
    names: string[];
    percentages: Array<{
      name: string;
      share: number;
    }>;
  };
  createdAt: Date;
  lastActivityAt: Date;
  defaultBranch: string;
  pipelineCounts: {
    finished: number;
    pending: number;
    running: number;
    all: number;
  };
  topics: string[];
}

export interface SerializedPipeline {
  project_fullPath: string;
  id: number;
  coverage: number;
  createdAt: Date;
  startedAt: Date;
  finishedAt: Date;
  ref: string;
  refPath: string;
  beforeSha: string;
  sha: string;
  status: string;
  duration: number;
  queuedDuration: number;
  commit: {
    authorName: string;
    authoredDate: Date;
    sha: string;
    webUrl: string;
  };
}

export interface SerializedJob {
  pipeline_id: number;
  project_fullPath: string;
  name: string;
  refName: string;
  coverage: number;
  queuedDuration: number;
  duration: number;
  id: number;
  stage_name: string;
  createdByTag: boolean;
  status: string;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}

export interface SerializedMergeRequest {
  project_fullPath: string;
  id: number;
  sourceBranch: string;
  targetBranch: string;
  mergedAt: Date;
  createdAt: Date;
  approved: boolean;
  approvedBy: Array<{ name: string; username: string }>;
  author: { name: string; username: string };
  commits: Array<{
    sha: string;
    shortId: string;
    title: string;
    authorName: string;
    authorEmail: string;
    authoredDate: Date;
    description: string;
  }>;
}
