import supabase from '@/services/supabase';
import { Todo } from './Todo.types';

const TodoService = {
  createTodo(data: Partial<Todo>) {
    return supabase.from('todo').insert([data]).select();
  },
  listTodo(params?: {
    author?: string;
    isDone?: boolean;
    tag?: number;
    status?: number[];
  }) {
    const isDone = params && Object.hasOwn(params, 'isDone');
    const tag = params && Object.hasOwn(params, 'tag');

    // let authorQuery = 'author.is.null';
    // if (params?.author) {
    //   authorQuery = `author.is.null,author.eq.${params.author}`;
    // }

    return supabase
      .from('todo')
      .select()
      .eq('author', params?.author)
      .eq(isDone ? 'isDone' : '', params?.isDone)
      .eq(tag ? 'tag' : '', params?.tag)
      .in('status', params?.status || []);
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
