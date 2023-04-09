import axios from 'axios';

const GitHubUrls = {
  getUsersDetail: (userId: string) => `https://api.github.com/users/${userId}`,
  getReposList: (userId: string) =>
    `https://api.github.com/users/${userId}/repos`,
  getReposDetail: (userId: string, repoId: string) =>
    `https://api.github.com/repos/${userId}/${repoId}`,
  getReposDetailLanguages: (userId: string, repoId: string) =>
    `https://api.github.com/repos/${userId}/${repoId}/languages`,
};

const GitHubService = {
  getReposDetail(userId: string, repoId: string) {
    return axios({
      method: 'GET',
      url: GitHubUrls.getReposDetail(userId, repoId),
    });
  },
  getReposList(userId: string) {
    return axios({
      method: 'GET',
      url: GitHubUrls.getReposList(userId),
    });
  },
  getReposDetailLanguages(userId: string, repoId: string) {
    return axios({
      method: 'GET',
      url: GitHubUrls.getReposDetailLanguages(userId, repoId),
    });
  },
  getUsersDetail(userId: string) {
    return axios({
      method: 'GET',
      url: GitHubUrls.getUsersDetail(userId),
    });
  },
};

export default GitHubService;
