import { Button, Table } from 'antd';
import axios from 'axios';
import config from 'libs/config';
import React, { useState } from 'react';
import { Octokit } from '@octokit/rest';

const baseUrl = config.apiUrl;
const token = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
  auth: token,
});

export default function Test() {
  const [list, setList] = useState([]);

  const handleClickPushNotication = () => {
    axios({
      url: `${baseUrl}/api/pushnotifications/`,
      method: 'POST',
      data: {
        title: 'Test',
        body: 'finish',
      },
    });
  };

  const handleClickPayment = () => {
    axios({
      url: `${baseUrl}/api/payments/`,
      method: 'POST',
    });
  };

  const handleStartJob = () => {
    axios({
      url: `${baseUrl}/api/test/start-job/`,
      method: 'GET',
    });
  };

  const handleCancelJob = () => {
    axios({
      url: `${baseUrl}/api/test/cancel-job/`,
      method: 'GET',
    });
  };

  const handleCreateStock = () => {
    axios({
      url: `${baseUrl}/api/stocks/create/`,
      method: 'POST',
    });
  };

  const handleGetStock = () => {
    axios({
      url: `${baseUrl}/api/stocks/`,
      method: 'GET',
    });
  };

  const test = async (repoName: string) => {
    if (!repoName) return null;
    try {
      const owner = 'InsightDataScience';
      // const repo = 'consulting-projects';
      const repo = repoName;

      const res = await octokit.request(
        `GET /repos/${owner}/${repo}/branches`,
        {
          owner,
          repo,
        }
      );

      if (res.data) {
        return { repo, data: res.data };
      }
      return null;
    } catch (e) {}
  };

  const testAll = async () => {
    try {
      const org = 'InsightDataScience';
      const res1 = await octokit.request(
        'GET /orgs/{org}/repos?type=private&per_page=100&page=1',
        {
          org,
        }
      );
      const res2 = await octokit.request(
        'GET /orgs/{org}/repos?type=private&per_page=100&page=2',
        {
          org,
        }
      );
      const list_repo = res1.data.concat(res2.data);
      const listPromises: any = [];

      list_repo.forEach((repo: any) => {
        listPromises.push(test(repo.name));
      });

      Promise.all(listPromises)
        .then((res: any) => {
          setList(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {}
  };

  const columns = [
    {
      title: 'repo',
      dataIndex: 'repo',
      key: 'repo',
    },
    {
      title: 'branch count',
      render: (data: any) => {
        return data.data && data.data.length;
      },
    },
  ];

  return (
    <div className="height-100 width-100" style={{ background: 'white' }}>
      <Button size="small" onClick={handleClickPayment}>
        Test payment
      </Button>
      <Button size="small" onClick={handleClickPushNotication}>
        Test Push notification
      </Button>
      <Button size="small" onClick={handleStartJob}>
        Start job
      </Button>
      <Button size="small" onClick={handleCancelJob}>
        Cancel job
      </Button>
      <Button size="small" onClick={testAll}>
        Test
      </Button>
      <Button size="small" onClick={handleCreateStock}>
        Create Stock
      </Button>
      <Button size="small" onClick={handleGetStock}>
        Get Stock
      </Button>
      <Table dataSource={list} columns={columns} size={'small'} />;
    </div>
  );
}
