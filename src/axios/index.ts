import axios, { AxiosInstance } from 'axios';

const sleepUtil = async (minutes?: number) => {
  const time: number = (minutes === undefined ? 1 : minutes) * 60 * 1000;
  console.table({ sleepFor: `${minutes === undefined ? 1 : minutes} min.` });
  await new Promise(resolve => setTimeout(resolve, time));
};

interface II {
  v4: AxiosInstance;
  gql: AxiosInstance;
}

export class Instance {
  private readonly instances!: II;
  private _counter: number = 0;

  constructor(gitlab_token: string) {
    const gql = axios.create({
      baseURL: 'https://gitlab.com/api/graphql',
      headers: {
        'Private-Token': gitlab_token,
      },
    });

    gql.interceptors.request.use(async conf => {
      this._counter++;
      if (this._counter % 2000 == 0) {
        await sleepUtil();
      }
      return conf;
    });

    const v4 = axios.create({
      baseURL: 'https://gitlab.com/api/v4',
      headers: {
        'Private-Token': gitlab_token,
      },
    });

    v4.interceptors.request.use(async conf => {
      this._counter++;
      if (this._counter % 2000 == 0) {
        await sleepUtil();
      }
      return conf;
    });

    this.instances = { gql, v4 };
  }

  public gql(): AxiosInstance {
    return this.instances.gql;
  }

  public v4(): AxiosInstance {
    return this.instances.v4;
  }
}
