import React, { useState, useEffect, useRef } from 'react';

import { useLocalStorage } from 'usehooks-ts';
import { Octokit } from '@octokit/rest';
import { Button, Input, notification, Divider, Spin } from 'antd';
import moment from 'moment';
import sum from 'lodash/sum';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import FirebaseCustom from 'components/FirebaseCustom';
import request, { CustomTradingViewUrls, RedirectUrls } from 'request';
import qs from 'qs';
import axios from 'axios';

const GITHUB_ACCOUNT = 'paulnguyen-mn';

export interface ITestProps {}

export default function Test(props: ITestProps) {
  const [gitHubToken, setGitHubToken] = useLocalStorage('gitHubToken', '');
  const [data, setData] = useState([] as any);
  const [loading, setLoading] = useState(false);
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
        username: GITHUB_ACCOUNT,
        per_page: 30,
        page: 1,
      });

      const list_promises: any = [];
      res.data.map((i: any) => {
        list_promises.push(
          octokit.rest.repos.get({
            owner: GITHUB_ACCOUNT,
            repo: i.name,
          })
        );
      });
      setLoading(true);
      Promise.all(list_promises)
        .then((res) => {
          console.log(res);
          setLoading(false);
          const mappedData = res.map((i) => i.data);
          setData(mappedData);
          fetchLanguages(mappedData);
        })
        .catch((e) => {});
    } catch (e) {
      setLoading(false);
    }
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

        const newPromise = async () => {
          const res = await octokit.rest.repos.listLanguages({
            owner: GITHUB_ACCOUNT,
            repo: i.name,
          });
          return {
            res,
            repo: i.name,
          };
        };
        console.log(newPromise);

        list_promises.push(newPromise());
      });
      setLoading(true);
      Promise.all(list_promises)
        .then((res) => {
          console.log(res);
          setLoading(false);
          const objRes = keyBy(res, 'repo');
          const newData = [...data];
          console.log(newData);
          newData.map((i) => {
            i.languages = objRes[i.name].res.data;

            const listLanguages: any = [];
            Object.keys(i.languages).map((j) => {
              listLanguages.push({
                language: j,
                count: i.languages[j],
              });
            });

            i.languagesShort = listLanguages
              .sort((a: any, b: any) => b.count - a.count)
              .splice(0, 3);

            i.languagesCount = sum(Object.values(i.languages));
            console.log(i);
            return i;
          });

          newData.sort((a, b) => b.languagesCount - a.languagesCount);
          console.log(newData);
          setData(newData);
          return res;
        })
        .catch((e) => {});
    } catch (e) {
      setLoading(false);
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

  const renderSummary = () => {
    const count = groupBy(data, 'language');
    console.log(count);
    return (
      <div>
        Summary
        <div>
          {Object.keys(count).map((i) => {
            return (
              <div>
                {i} - {count[i].length}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderList = () => {
    return (
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
                <div style={{ width: '100px' }}>{i.languagesCount}</div>
                <div style={{ flex: 1, display: 'flex', overflow: 'auto' }}>
                  {i.languagesShort &&
                    i.languagesShort.map((j: any) => {
                      return (
                        <div style={{ width: '100px' }}>
                          <div>{j.language}</div>
                          <div>{j.count}</div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <Divider />
            </>
          );
        })}
      </div>
    );
  };

  // useEffect(() => {
  //   octokit = new Octokit({
  //     auth: gitHubToken,
  //   });
  // }, []);

  useEffect(() => {
    // request({
    //   url: RedirectUrls.g
    //   method: 'GET',
    //   params: {
    //     redirect_url: CustomTradingViewUrls.getSearchInfoSymbol('FPT'),
    //   },
    // });
    const symbol = 'LAS';
    const resolution = '1';
    const from = parseInt(moment('08/26/2022 09:00').format('X'));
    const to = parseInt(moment('08/26/2022 09:00').format('X'));

    axios({
      method: 'GET',
      url: `https://dchart-api.vndirect.com.vn/dchart/history?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`,
    });
    // axios({
    //   method: 'GET',
    //   url: `https://dchart-api.vndirect.com.vn/dchart/history?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`,
    // });
  }, []);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Component />
      {loading && <Spin />}
      <Input onChange={(e) => handleChange(e)} />

      <Button onClick={handleClickFetch}>Fetch</Button>
      <FirebaseCustom />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div>{renderSummary()}</div>
        <div style={{ flex: 1, overflow: 'auto' }}>{renderList()}</div>
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
