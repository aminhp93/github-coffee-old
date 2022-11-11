import request, { PostUrls } from 'libs/request';

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
  detailPost(postSlug: string) {
    return request({
      method: 'GET',
      url: PostUrls.detailPost(postSlug),
    });
  },
  updatePost(postSlug: string, data: any) {
    return request({
      method: 'PUT',
      url: PostUrls.updatePost(postSlug),
      data,
    });
  },
  deletePost(postSlug: any) {
    return request({
      method: 'DELETE',
      url: PostUrls.deletePost(postSlug),
    });
  },
};
