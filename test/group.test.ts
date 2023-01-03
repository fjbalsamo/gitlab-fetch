import { GitlabFetch } from '../src';

const GITLAB_TOKEN: string = process.env.GITLAB_TOKEN || '';
const GITLAB_GROUP_PATH: string =
  process.env.GITLAB_GROUP_PATH || '*_no//_group';

describe('Groups', () => {
  it('no token', async () => {
    const t = new GitlabFetch(GITLAB_TOKEN);

    const g = await t.groups.getOne(GITLAB_GROUP_PATH);

    expect(g).toBe(undefined);
  });
});
