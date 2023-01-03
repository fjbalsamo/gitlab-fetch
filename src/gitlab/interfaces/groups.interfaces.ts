import { ICommonGroup, ICommonPageInfo } from './common.interfaces';

export interface GitlabGroup {
  data: Data;
}

interface Data {
  group: null | Group;
}

export interface DescendantGroups {
  pageInfo: ICommonPageInfo;
  nodes: Group[];
}

export interface Group extends ICommonGroup {
  descendantGroups?: DescendantGroups;
}
