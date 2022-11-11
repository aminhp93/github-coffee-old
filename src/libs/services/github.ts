import request, { GitHubUrls } from 'libs/request';

export const GitHubService = {
  getReposDetail() {
    return request({
      method: 'GET',
      url: GitHubUrls.getReposDetail,
    });
  },
  getReposList(userId: string) {
    return request({
      method: 'GET',
      url: GitHubUrls.getReposList(userId),
    });
  },
  getReposDetailLanguages(userId: string, repoId: string) {
    return request({
      method: 'GET',
      url: GitHubUrls.getReposDetailLanguages(userId, repoId),
    });
  },
  getUsersDetail(userId: string) {
    return request({
      method: 'GET',
      url: GitHubUrls.getUsersDetail(userId),
    });
  },
};
