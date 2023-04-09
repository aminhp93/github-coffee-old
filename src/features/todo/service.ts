import supabase from '@/services/supabase';
import { Todo } from './types';

const TodoService = {
  createTodo(data: Partial<Todo>) {
    return supabase.from('todo').insert([data]).select();
  },
  listTodo(params?: Partial<Todo>) {
    const isDone = params && Object.hasOwnProperty.call(params, 'isDone');
    const tag = params && Object.hasOwnProperty.call(params, 'tag');
    // let authorQuery = 'author.is.null';
    // if (params?.author) {
    //   authorQuery = `author.is.null,author.eq.${params.author}`;
    // }

    return supabase
      .from('todo')
      .select()
      .eq('author', params?.author)
      .eq(isDone ? 'isDone' : '', params?.isDone)
      .eq(tag ? 'tag' : '', params?.tag);
    // .or(authorQuery);
  },
  detailTodo(todoId: number) {
    return supabase.from('todo').select().eq('id', todoId);
  },
  updateTodo(todoId: number, data: Partial<Todo>) {
    return supabase.from('todo').update(data).eq('id', todoId).select();
  },
  deleteTodo(todoId: number) {
    return supabase.from('todo').delete().eq('id', todoId);
  },
};

export default TodoService;
