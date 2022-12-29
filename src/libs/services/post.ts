import request from 'libs/request';
import config from 'libs/config';

const baseUrl = config.apiUrl;

export const PostUrls = {
  createPost: `${baseUrl}/api/posts/create/`,
  listPost: `${baseUrl}/api/posts/`,
  detailPost: (postId: number) => `${baseUrl}/api/posts/${postId}/`,
  updatePost: (postId: number) => `${baseUrl}/api/posts/${postId}/`,
  deletePost: (postId: number) => `${baseUrl}/api/posts/${postId}/`,
};

export const PostService = {
  createPost(data: any) {
    return request({
      method: 'POST',
      url: PostUrls.createPost,
      data,
    });
  },
  listPost() {
    return request({
      method: 'GET',
      url: PostUrls.listPost,
    });
  },
  detailPost(postId: number) {
    return request({
      method: 'GET',
      url: PostUrls.detailPost(postId),
    });
  },
  updatePost(postId: number, data: any) {
    return request({
      method: 'PUT',
      url: PostUrls.updatePost(postId),
      data,
    });
  },
  deletePost(postId: number) {
    return request({
      method: 'DELETE',
      url: PostUrls.deletePost(postId),
    });
  },
};
