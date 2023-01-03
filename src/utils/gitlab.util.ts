import { AxiosResponse } from 'axios';
import {
  SerializedGroup,
  SerializedJob,
  SerializedMergeRequest,
  SerializedPipeline,
  SerializedProject,
} from '../gitlab/interfaces/common.interfaces';
import { Group } from '../gitlab/interfaces/groups.interfaces';
import { MergeRequestsNode } from '../gitlab/interfaces/mrc.interfaces';
import {
  JobsNode,
  PipelinesNode,
} from '../gitlab/interfaces/pipelines.interfaces';
import { ProjectItem } from '../gitlab/interfaces/projects.interfaces';

export class GitlabUtil {
  public static strIdToInt(id: string): number {
    const split = id.split('/');
    return Number(split[split.length - 1]);
  }

  public static serializeGroup(group: Group): SerializedGroup {
    const { avatarUrl, description, id, ...rest } = group;

    return {
      ...rest,
      id: GitlabUtil.strIdToInt(id),
      avatarUrl: avatarUrl === null ? undefined : avatarUrl,
      description: description === null ? '' : description,
    };
  }

  public static serializeProject(project: ProjectItem): SerializedProject {
    const {
      avatarUrl,
      id,
      languages,
      description,
      repository,
      topics,
      ...rest
    } = project;

    return {
      id: GitlabUtil.strIdToInt(id),
      description: description === null ? '' : description,
      avatarUrl: avatarUrl === null ? undefined : avatarUrl,
      languages: {
        names: languages.map(e => e.name),
        percentages: languages.map(e => e),
      },
      defaultBranch: repository.rootRef === null ? '' : repository.rootRef,
      topics: topics.map(t => String(t)),
      ...rest,
    };
  }

  public static serializePipeline(
    fullPath: string,
    pipeline: PipelinesNode
  ): SerializedPipeline {
    const { commit, coverage, id, jobs, ...rest } = pipeline;
    return {
      commit: {
        authoredDate: commit.authoredDate,
        authorName: commit.author.name,
        sha: commit.sha,
        webUrl: commit.webUrl,
      },
      coverage: coverage === null ? 0 : coverage,
      id: GitlabUtil.strIdToInt(id),
      project_fullPath: fullPath,
      ...rest,
    };
  }

  public static serializeJob(
    fullPath: string,
    pipeline_id: string,
    job: JobsNode
  ): SerializedJob {
    const {
      coverage,
      pipeline,
      queuedDuration,
      stage,
      duration,
      id,
      startedAt,
      finishedAt,
      ...rest
    } = job;
    return {
      ...rest,
      project_fullPath: fullPath,
      pipeline_id: GitlabUtil.strIdToInt(pipeline_id),
      coverage: coverage === null ? 0 : coverage,
      queuedDuration: queuedDuration === null ? 0 : queuedDuration,
      stage_name: stage.name,
      duration: duration === null ? 0 : duration,
      id: GitlabUtil.strIdToInt(id),
      finishedAt: finishedAt === null ? undefined : finishedAt,
      startedAt: startedAt === null ? undefined : startedAt,
    };
  }

  public static serializeMR(
    fullPath: string,
    mr: MergeRequestsNode
  ): SerializedMergeRequest {
    const { approvedBy, author, commits, id, ...rest } = mr;
    return {
      project_fullPath: fullPath,
      ...rest,
      author: author,
      commits: commits.nodes.map(c => c),
      approvedBy: approvedBy.nodes,
      id: GitlabUtil.strIdToInt(id),
    };
  }

  public static gqlError({
    response,
  }: {
    response: AxiosResponse<any, any>;
  }): void | never {
    const keys = Object.keys(response.data);

    if (keys.includes('errors')) {
      const message: string = response.data.errors[0].message || 'unknow error';
      throw new Error(message);
    }

    if (keys.includes('data')) {
      const data = response.data.data;
      const [node] = Object.keys(data);

      if (data[node] === null) throw new Error(`${node} is null`);
    }
  }
}
