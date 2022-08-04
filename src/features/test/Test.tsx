import React, { useState, useEffect, useRef } from 'react';

import { useLocalStorage } from 'usehooks-ts';
import { GitHubService } from 'services';
import { Octokit } from '@octokit/rest';
import { Button, Input, notification, Divider } from 'antd';
import moment from 'moment';

export interface ITestProps {}

export default function Test(props: ITestProps) {
  const [gitHubToken, setGitHubToken] = useLocalStorage('gitHubToken', '');
  const [data, setData] = useState([] as any);
  let octokit: any;

  console.log(gitHubToken);

  const fetchData = async () => {
    if (!octokit) return;
    try {
      // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo

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
      });

      Promise.all(list_promises)
        .then((res) => {
          console.log(res);
          const mappedData = res.map((i) => i.data);
          setData(mappedData);
          fetchLanguages(mappedData);
        })
        .catch((e) => {});
    } catch (e) {}
  };

  const fetchLanguages = (data: any) => {
    if (!octokit) return;
    try {
      const list_promises: any = [];
      data.map((i: any) => {
        //  list_promises.push(
        //     octokit.rest.repos.listCommits({
        //       owner: 'aminhp93',
        //       repo: i.name,
        //     })
        //   );

        const newPromise = octokit.rest.repos.listLanguages({
          owner: 'aminhp93',
          repo: i.name,
        });

        list_promises.push(newPromise);
      });

      Promise.all(list_promises)
        .then((res) => {
          console.log(res);

          // setData(mappedData);
          return res;
        })
        .catch((e) => {});
    } catch (e) {
      //
    }
  };

  const handleClickFetch = () => {
    if (!gitHubToken) {
      return notification.error({ message: 'No token' });
    }
    fetchData();
  };

  const handleChange = (e: any) => {
    setGitHubToken(e.target.value);
  };

  console.log(data);

  useEffect(() => {
    octokit = new Octokit({
      auth: gitHubToken,
    });
  }, []);

  return (
    <div>
      <Component />

      <Input onChange={(e) => handleChange(e)} />
      <Button onClick={handleClickFetch}>Fetch</Button>
      <div>
        {data.map((i: any) => {
          return (
            <>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100px' }}>{i.name}</div>
                <div style={{ width: '100px' }}>
                  {moment(i.created_at).format('YYYY-MM-DD')}
                </div>
                <div style={{ width: '100px' }}>
                  {moment(i.updated_at).format('YYYY-MM-DD')}
                </div>
                <div style={{ width: '100px' }}>{i.language}</div>
              </div>
              <Divider />
            </>
          );
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
