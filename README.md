# Gitlab Fetch

library to get groups, projects, pipelines and commits from gitlab

## Install

```bash
npm install @ts-racers/gitlab-fetch # or yarn add @ts-racers/gitlab-fetch
```

## Usage

### Groups

```typescript
import { GitlabFetch } from '@ts-racers/gitlab-fetch';

const { groups } = new GitlabFetch('gitlab-token');

(async () => {
  // get one group
  const myGroup = await groups.getOne('my-group');
  console.log(myGroup);
  /*
  {
    id: number; 
    avatarUrl?: string
    description: string;
    name: string;
    fullName: string;
    path: string;
  } | undefined
  */

  // get one group and yours subgroups
  const descendantGroups = await groups.descendantGroups({
    fullPath: 'my-group',
    includeParentDescendants: true, // default is false
  });
  console.log(descendantGroups);
  /*
  {
     group: {id: number; ... }
     subgroups: Array<{id: number; ... }>
  } | undefined
  */
})();
```

### Projects

```typescript
import { GitlabFetch } from '@ts-racers/gitlab-fetch';

const { projects } = new GitlabFetch('gitlab-token');

(async () => {
  // get one group
  const myProjects = await projects.projectsByGroup({
    fullPath: 'my-group',
    includeSubGroups: true, // default is false
  });
  console.log(myProjects);
  /*
  {
    group: {id: number, ... },
    projects: Array<{
      id: number;
      name: string;
      fullPath: string;
      path: string;
      webUrl: string;
      sshUrlToRepo: string;
      httpUrlToRepo: string;
      description: null | string;
      avatarUrl?: string;
      languages: {
        names: string[];
        percentages: Array<{
          name: string;
          share: number;
        }>;
      };
      createdAt: Date;
      lastActivityAt: Date;
      defaultBranch: string;
      pipelineCounts: {
        finished: number;
        pending: number;
        running: number;
        all: number;
      };
      topics: string[];
    }>
  } | undefined
  */

  // get one group and yours subgroups
  const descendantGroups = await groups.descendantGroups({
    fullPath: 'my-group',
    includeParentDescendants: true, // default is false
  });
  console.log(descendantGroups);
  /*
  {
     group: {id: number; ... }
     subgroups: Array<{id: number; ... }>
  } | undefined
  */
})();
```

### Pipelines and Jobs

```typescript
import { GitlabFetch } from '@ts-racers/gitlab-fetch';

const { pipelines } = new GitlabFetch(
  'gitlab-token'
);

(async () => {
  // get pipelines and jobs
  const pipesAndJobs = await pipelines.pipelinesAndJobs({
    fullPath: 'path/of/my/gitlab-project',
    updatedAfter: new Date(), // default is undefined
  });
  console.log(pipesAndJobs);
  /*
  {
    pipelines: Array<{
      project_fullPath: string;
      id: number;
      coverage: number;
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
      commit: {
        authorName: string;
        authoredDate: Date;
        sha: string;
        webUrl: string;
      };
    }>
    jobs: Array<{
      pipeline_id: number;
      project_fullPath: string;
      name: string;
      refName: string;
      coverage: number;
      queuedDuration: number;
      duration: number;
      id: number;
      stage_name: string;
      createdByTag: boolean;
      status: string;
      createdAt: Date;
      startedAt?: Date;
      finishedAt?: Date;
    }>
  }
  */
```

### Merge Requests

```typescript
import { GitlabFetch } from '@ts-racers/gitlab-fetch';

const { mergeRequests } = new GitlabFetch(
  'gitlab-token'
);

(async () => {
  // get merge requests commits
  const mergeRequestsCommits = await mergeRequests.mergeRequestsCommits({
    fullPath: 'path/of/my/gitlab-project',
    targetBranches: ["master", "main"],
    updatedAfter: new Date(), // default is undefined
  });
  console.log(mergeRequestsCommits);
  /*
  [
    {
      project_fullPath: string;
      id: number;
      sourceBranch: string;
      targetBranch: string;
      mergedAt: Date;
      createdAt: Date;
      approved: boolean;
      approvedBy: Array<{ name: string; username: string }>;
      author: { name: string; username: string };
      commits: Array<{
        sha: string;
        shortId: string;
        title: string;
        authorName: string;
        authorEmail: string;
        authoredDate: Date;
        description: string;
      }>;
    }
  ]
  */
```
