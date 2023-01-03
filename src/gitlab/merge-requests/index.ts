import { AxiosInstance } from 'axios';
import { GitlabUtil } from '../../utils/gitlab.util';
import { SerializedMergeRequest } from '../interfaces/common.interfaces';
import {
  GitlabMergeRequests,
  MergeRequests,
} from '../interfaces/mrc.interfaces';

const mrQuery = `
query Query($fullPath: ID!, $after: String, $updatedAfter: Time, $targetBranches: [String!]) {
    project(fullPath: $fullPath) {
      mergeRequests(
        state: merged
        createdAfter: $updatedAfter
        after: $after
        targetBranches: $targetBranches
      ) {
        count
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          sourceBranch
          targetBranch
          mergedAt
          createdAt
          approved
          approvedBy {
            nodes {
              name
              username
            }
          }
          author {
            name
            username
          }
          commits {
            nodes {
              sha
              shortId
              title
              authorName
              authorEmail
              authoredDate
              description
            }
          }
        }
      }
    }
  }  
`;

export class MergeRequestsProject {
  constructor(private readonly gql: AxiosInstance) {}

  public async mergeRequestsCommits(
    fullPath: string,
    targetBranches: string[],
    updatedAfter?: Date
  ): Promise<SerializedMergeRequest[]> {
    const date: string | undefined =
      updatedAfter === undefined
        ? undefined
        : new Date(updatedAfter).toISOString().split('T')[0];

    const collector: SerializedMergeRequest[] = [];
    let hasNextPage: boolean = false;
    let endCursor: string = '';

    const collectorFn = (data: MergeRequests) => {
      collector.push(
        ...data.nodes.map(mr => GitlabUtil.serializeMR(fullPath, mr))
      );

      hasNextPage = data.pageInfo.hasNextPage;
      endCursor = data.pageInfo.endCursor;
    };

    const { data } = await this.gql.post<GitlabMergeRequests>('/', {
      query: mrQuery,
      variables: {
        fullPath,
        targetBranches,
        updatedAfter: date,
      },
    });

    if (data.data.project === null) return [];

    collectorFn(data.data.project.mergeRequests);

    while (hasNextPage) {
      const { data } = await this.gql.post<GitlabMergeRequests>('/', {
        query: mrQuery,
        variables: {
          fullPath,
          targetBranches,
          updatedAfter: date,
          after: endCursor,
        },
      });

      if (data.data.project !== null) {
        collectorFn(data.data.project.mergeRequests);
      }
    }

    return collector;
  }
}
