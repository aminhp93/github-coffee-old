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
