import { ICommonGroup, ICommonPageInfo } from './common.interfaces';

export interface GitlabProjects {
  data: Data;
}

interface Data {
  group: null | Group;
}

interface Group extends ICommonGroup {
  projects: Projects;
}

export interface Projects {
  pageInfo: ICommonPageInfo;
  count: number;
  nodes: ProjectItem[];
}

export interface ProjectItem {
  id: string;
  name: string;
  fullPath: string;
  path: string;
  webUrl: string;
  sshUrlToRepo: string;
  httpUrlToRepo: string;
  description: null | string;
  avatarUrl: null | string;
  languages: Language[];
  createdAt: Date;
  lastActivityAt: Date;
  repository: Repository;
  pipelineCounts: PipelineCounts;
  topics: string[];
}

interface Language {
  name: string;
  share: number;
}

interface PipelineCounts {
  finished: number;
  pending: number;
  running: number;
  all: number;
}

interface Repository {
  rootRef: string | null;
  empty: boolean;
}
