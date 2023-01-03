import { AxiosInstance } from 'axios';
import { GitlabUtil } from '../../utils/gitlab.util';
import {
  SerializedJob,
  SerializedPipeline,
} from '../interfaces/common.interfaces';
import { GitlabPipelines, Pipelines } from '../interfaces/pipelines.interfaces';

const pipeinesQuery = `
query Query($fullPath: ID!, $after: String, $updatedAfter: Time) {
    project(fullPath: $fullPath) {
      pipelines(after: $after, updatedAfter: $updatedAfter) {
        count
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          coverage
          createdAt
          startedAt
          finishedAt
          ref
          refPath
          beforeSha
          sha
          status
          duration
          queuedDuration
          commit {
            author {
              name
            }
            id
            sha
            title
            webPath
            webUrl
            authoredDate
          }
          jobs {
            count
            nodes {
              pipeline {
                id
              }
              name
              refName
              coverage
              queuedDuration
              duration
              id
              stage {
                name
              }
              createdByTag
              status
              createdAt
              startedAt
              finishedAt
            }
          }
        }
      }
    }
  }  
`;

export class PipelinesProject {
  constructor(private readonly gql: AxiosInstance) {}

  public async pipelinesAndJobs({
    fullPath,
    updatedAfter,
  }: {
    fullPath: string;
    updatedAfter?: Date;
  }): Promise<{ pipelines: SerializedPipeline[]; jobs: SerializedJob[] }> {
    const pipelines: SerializedPipeline[] = [];
    const jobs: SerializedJob[] = [];
    let hasNextPage: boolean = false;
    let endCursor: string = '';

    const pipelinesCollectorFn = (pipe: Pipelines) => {
      pipe.nodes.forEach(p => {
        pipelines.push(GitlabUtil.serializePipeline(fullPath, p));

        jobs.push(
          ...p.jobs.nodes.map(j => GitlabUtil.serializeJob(fullPath, p.id, j))
        );
        hasNextPage = pipe.pageInfo.hasNextPage;
        endCursor = pipe.pageInfo.endCursor;
      });
    };

    const date: string | undefined =
      updatedAfter === undefined
        ? undefined
        : new Date(updatedAfter).toISOString().split('T')[0];

    const { data } = await this.gql.post<GitlabPipelines>('/', {
      query: pipeinesQuery,
      variables: {
        fullPath,
        updatedAfter: date,
      },
    });

    if (data.data.project === null) return { jobs: [], pipelines: [] };

    pipelinesCollectorFn(data.data.project.pipelines);

    while (hasNextPage) {
      const { data } = await this.gql.post<GitlabPipelines>('/', {
        query: pipeinesQuery,
        variables: {
          fullPath,
          updatedAfter: date,
          after: endCursor,
        },
      });

      if (data.data.project !== null) {
        pipelinesCollectorFn(data.data.project.pipelines);
      }
    }

    return {
      pipelines,
      jobs,
    };
  }
}
