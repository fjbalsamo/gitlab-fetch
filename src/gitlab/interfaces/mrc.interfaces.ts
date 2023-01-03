import { ICommonPageInfo } from './common.interfaces';

export interface GitlabMergeRequests {
  data: Data;
}

interface Data {
  project: null | Project;
}

interface Project {
  mergeRequests: MergeRequests;
}

export interface MergeRequests {
  count: number;
  pageInfo: ICommonPageInfo;
  nodes: MergeRequestsNode[];
}

export interface MergeRequestsNode {
  id: string;
  sourceBranch: string;
  targetBranch: string;
  mergedAt: Date;
  createdAt: Date;
  approved: boolean;
  approvedBy: ApprovedBy;
  author: Author;
  commits: Commits;
}

interface ApprovedBy {
  nodes: Author[];
}

interface Commits {
  nodes: CommitsNode[];
}

interface CommitsNode {
  sha: string;
  shortId: string;
  title: string;
  authorName: string;
  authorEmail: string;
  authoredDate: Date;
  description: string;
}

interface Author {
  name: string;
  username: string;
}
