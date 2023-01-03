import { ICommonPageInfo } from './common.interfaces';

export interface GitlabPipelines {
  data: Data;
}

interface Data {
  project: null | Project;
}

interface Project {
  pipelines: Pipelines;
}

export interface Pipelines {
  count: number;
  pageInfo: ICommonPageInfo;
  nodes: PipelinesNode[];
}

export interface PipelinesNode {
  id: string;
  coverage: number | null;
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
  commit: Commit;
  jobs: Jobs;
}

interface Commit {
  author: Author;
  id: string;
  sha: string;
  title: string;
  webPath: string;
  webUrl: string;
  authoredDate: Date;
}

interface Author {
  name: string;
}

interface Jobs {
  count: number;
  nodes: JobsNode[];
}

export interface JobsNode {
  pipeline: Pipeline;
  name: string;
  refName: string;
  coverage: number | null;
  queuedDuration: number | null;
  duration: number | null;
  id: string;
  stage: Author;
  createdByTag: boolean;
  status: string;
  createdAt: Date;
  startedAt: Date | null;
  finishedAt: Date | null;
}

interface Pipeline {
  id: string;
}
