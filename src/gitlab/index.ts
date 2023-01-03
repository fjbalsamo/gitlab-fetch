import { AxiosInstance } from 'axios';
import { Instance } from '../axios';
import { GitlabGroups } from './groups';
import { MergeRequestsProject } from './merge-requests';
import { PipelinesProject } from './pipelines';
import { GitlabProject } from './projects';

export default class {
  private readonly gql!: AxiosInstance;
  private readonly v4!: AxiosInstance;

  public readonly groups!: GitlabGroups;
  public readonly projects!: GitlabProject;
  public readonly pipelines!: PipelinesProject;
  public readonly mergeRequests!: MergeRequestsProject;

  constructor(gitlab_token: string) {
    const i = new Instance(gitlab_token);
    this.gql = i.gql();
    this.v4 = i.v4();
    this.groups = new GitlabGroups(this.gql);
    this.projects = new GitlabProject(this.gql);
    this.pipelines = new PipelinesProject(this.gql);
    this.mergeRequests = new MergeRequestsProject(this.gql);
  }

  public async gqlRun<T>({
    query,
    variables,
  }: {
    query: string;
    variables?: { [x: string]: any };
  }) {
    return await this.gql.post<T>('/', { query, variables });
  }

  public async v4Run<T>({
    method,
    url,
    data,
  }: {
    method: 'POST' | 'PUT' | 'DELETE' | 'GET';
    url: string;
    data?: any;
  }) {
    return await this.v4<T>({
      method,
      url,
      data,
    });
  }
}
