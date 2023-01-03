import { AxiosInstance } from 'axios';
import { GitlabProjects, Projects } from '../interfaces/projects.interfaces';
import {
  SerializedGroup,
  SerializedProject,
} from '../interfaces/common.interfaces';
import { GitlabUtil } from '../../utils/gitlab.util';

const projectsByGroupQuery = `
query Query($fullPath: ID!, $includeSubgroups: Boolean, $after: String) {
    group(fullPath: $fullPath) {
      id
      name
      fullName
      path
      fullName
      fullPath
      avatarUrl
      description
      projects(includeSubgroups: $includeSubgroups, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        count
        nodes {
          id
          name
          fullPath
          path
          webUrl
          sshUrlToRepo
          httpUrlToRepo
          description
          avatarUrl
          languages {
            name
            share
          }
          createdAt
          lastActivityAt
          repository {
            rootRef
            empty
          }
          pipelineCounts {
            finished
            pending
            running
            all
          }
          topics
        }
      }
    }
  }  
`;

export class GitlabProject {
  constructor(private readonly qgl: AxiosInstance) {}

  public async projectsByGroup({
    fullPath,
    includeSubGroups = false,
  }: {
    fullPath: string;
    includeSubGroups?: boolean;
  }): Promise<
    { group: SerializedGroup; projects: SerializedProject[] } | undefined
  > {
    const collector: SerializedProject[] = [];
    let hasNextPage: boolean = false;
    let endCursor: string = '';

    const projectsCollectorFn = (projects: Projects) => {
      collector.push(
        ...projects.nodes.map(e => GitlabUtil.serializeProject(e))
      );
      hasNextPage = projects.pageInfo.hasNextPage;
      endCursor = projects.pageInfo.endCursor;
    };

    const { data } = await this.qgl.post<GitlabProjects>('/', {
      query: projectsByGroupQuery,
      variables: {
        fullPath,
        includeSubGroups,
      },
    });

    if (data.data.group === null) return undefined;

    const { projects, ...rootGroup } = data.data.group;

    projectsCollectorFn(projects);

    while (hasNextPage) {
      const { data } = await this.qgl.post<GitlabProjects>('/', {
        query: projectsByGroupQuery,
        variables: {
          fullPath,
          includeSubGroups,
          after: endCursor,
        },
      });

      if (data.data.group !== null) {
        projectsCollectorFn(data.data.group.projects);
      }
    }

    return {
      group: GitlabUtil.serializeGroup(rootGroup),
      projects: collector,
    };
  }
}
