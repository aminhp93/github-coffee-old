import request from '@/services/request';
import config from '@/config';

const baseUrl = config.apiUrl;

const TodoUrls = {
  createTodo: `${baseUrl}/api/todos/create/`,
  listTodo: `${baseUrl}/api/todos/`,
  detailTodo: (todoId: number) => `${baseUrl}/api/todos/${todoId}/`,
  updateTodo: (todoId: number) => `${baseUrl}/api/todos/${todoId}/`,
  deleteTodo: (todoId: number) => `${baseUrl}/api/todos/${todoId}/`,
};

const TodoService = {
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

export default TodoService;
