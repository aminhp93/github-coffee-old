import supabase from '@/services/supabase';
import { Todo } from './types';

const TodoService = {
  createTodo(data: Partial<Todo>) {
    return supabase.from('todo').insert([data]).select();
  },
  listTodo(params?: {
    author?: string;
    isDone?: boolean;
    tag?: number;
    // status?: number[];
  }) {
    let isDoneObj: {
      key: string;
      value: boolean | undefined;
    } = {
      key: '',
      value: undefined,
    };
    if (params?.isDone === false) {
      // only get the todo that is not done
      isDoneObj = {
        key: 'isDone',
        value: false,
      };
    }

    const tag = params && Object.hasOwn(params, 'tag');

    // let authorQuery = 'author.is.null';
    // if (params?.author) {
    //   authorQuery = `author.is.null,author.eq.${params.author}`;
    // }

    return supabase
      .from('todo')
      .select()
      .eq('author', params?.author)
      .eq(isDoneObj.key, isDoneObj.value)
      .eq(tag ? 'tag' : '', params?.tag);
    // .in('status', params?.status || []);
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
