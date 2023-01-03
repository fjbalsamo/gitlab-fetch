import { AxiosInstance } from 'axios';
import { GitlabUtil } from '../../utils/gitlab.util';
import { GitlabGroup, DescendantGroups } from '../interfaces/groups.interfaces';
import { SerializedGroup } from '../interfaces/common.interfaces';

const getOnequery = `
query Query($fullPath: ID!) {
    group(fullPath: $fullPath) {
      id
      name
      fullName
      path
      fullName
      avatarUrl
      description
    }
  }
`;

const descendantGroupsQuery = `
query Query($fullPath: ID!, $includeParentDescendants: Boolean, $after: String) {
    group(fullPath: $fullPath) {
      id
      name
      fullName
      path
      fullPath
      avatarUrl
      description
      descendantGroups(
        includeParentDescendants: $includeParentDescendants
        after: $after
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          name
          fullName
          path
          fullPath
          avatarUrl
          description
        }
      }
    }
  }
`;

export class GitlabGroups {
  constructor(private readonly qgl: AxiosInstance) {}

  public async getOne(fullPath: string): Promise<SerializedGroup | undefined> {
    const { data } = await this.qgl.post<GitlabGroup>('/', {
      query: getOnequery,
      variables: { fullPath },
    });
    if (data.data.group === null) return undefined;
    return GitlabUtil.serializeGroup(data.data.group);
  }

  public async descendantGroups({
    fullPath,
    includeParentDescendants = false,
  }: {
    fullPath: string;
    includeParentDescendants?: boolean;
  }): Promise<
    { group: SerializedGroup; subgroups: SerializedGroup[] } | undefined
  > {
    const collector: SerializedGroup[] = [];
    let hasNextPage: boolean = false;
    let endCursor: string = '';

    const descendantGroupsCollectorFn = (param?: DescendantGroups): void => {
      if (param !== undefined) {
        collector.push(...param.nodes.map(g => GitlabUtil.serializeGroup(g)));
        hasNextPage = param.pageInfo.hasNextPage;
        endCursor = param.pageInfo.endCursor;
      }
    };

    const { data } = await this.qgl.post<GitlabGroup>('/', {
      query: descendantGroupsQuery,
      variables: {
        fullPath,
        includeParentDescendants,
      },
    });

    if (data.data.group === null) return undefined;

    descendantGroupsCollectorFn(data.data.group.descendantGroups);

    while (hasNextPage) {
      const { data } = await this.qgl.post<GitlabGroup>('/', {
        query: descendantGroupsQuery,
        variables: {
          fullPath,
          includeParentDescendants,
          after: endCursor,
        },
      });

      if (data.data.group !== null) {
        descendantGroupsCollectorFn(data.data.group.descendantGroups);
      }
    }

    return {
      group: GitlabUtil.serializeGroup(data.data.group),
      subgroups: collector,
    };
  }
}
