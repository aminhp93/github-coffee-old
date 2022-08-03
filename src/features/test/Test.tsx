import request from 'request';
import React, { useState, useEffect, useRef } from 'react';

import { useLocalStorage } from 'usehooks-ts';
import { GitHubService } from 'services';
import { Octokit } from '@octokit/rest';

export interface ITestProps {}

export default function Test(props: ITestProps) {
  const [data, setData] = useState([] as any);

  const fetchData = async () => {
    try {
      // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
      const octokit = new Octokit({
        auth: `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`,
      });

      const {
        data: { login },
      } = await octokit.rest.users.getAuthenticated();
      console.log('Hello, %s', login);

      const res: any = await octokit.rest.repos.listForUser({
        username: 'aminhp93',
        per_page: 10,
        page: 1,
      });

      const list_promises: any = [];
      res.data.map((i: any) => {
        list_promises.push(
          octokit.rest.repos.get({
            owner: 'aminhp93',
            repo: i.name,
          })
        );

        // list_promises.push(
        //   octokit.rest.repos.listCommits({
        //     owner: 'aminhp93',
        //     repo: i.name,
        //   })
        // );
      });

      Promise.all(list_promises)
        .then((res) => {
          console.log(res);
          const mappedData = res.map((i) => i.data);
          setData(mappedData);
        })
        .catch((e) => {});
    } catch (e) {}
  };

  useEffect(() => {
    fetchData();
  });

  console.log(data);

  return (
    <div>
      <Component />
      <div>
        {data.map((i: any) => {
          return <div>{i.name}</div>;
        })}
      </div>
    </div>
  );
}

function Component() {
  const [isDarkTheme, setDarkTheme] = useLocalStorage('darkTheme', true);

  const toggleTheme = () => {
    setDarkTheme((prevValue) => !prevValue);
  };

  return (
    <button onClick={toggleTheme}>
      {`The current theme is ${isDarkTheme ? `dark` : `light`}`}
    </button>
  );
}
