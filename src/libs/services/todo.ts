import request, { TodoUrls } from 'libs/request';

export const TodoService = {
  createTodo(data: any) {
    return request({
      method: 'POST',
      url: TodoUrls.createTodo,
      data,
    });
  },
  listTodo(params: any, requestUrl?: string) {
    if (requestUrl) {
      return request({
        method: 'GET',
        url: requestUrl,
      });
    }
    return request({
      method: 'GET',
      url: TodoUrls.listTodo,
      params,
    });
  },
  detailTodo(todoId: number) {
    return request({
      method: 'GET',
      url: TodoUrls.detailTodo(todoId),
    });
  },
  updateTodo(todoId: number, data: any) {
    return request({
      method: 'PUT',
      url: TodoUrls.updateTodo(todoId),
      data,
    });
  },
  deleteTodo(todoId: number) {
    return request({
      method: 'DELETE',
      url: TodoUrls.deleteTodo(todoId),
    });
  },
};
