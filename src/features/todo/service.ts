import supabase from '@/services/supabase';
import { Todo } from './types';

const TodoService = {
  createTodo(data: Partial<Todo>) {
    return supabase.from('todo').insert([data]).select();
  },
  listTodo(params?: {
    author?: string;
    isDone?: boolean;
    isRecurring?: boolean;
    showAll?: boolean;
  }) {
    // get query in supabase todo table where updated is today
    // or
    // get query in supabase todo table where author is the same as the author in params

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startOfDayISO = startOfDay.toISOString();

    if (params?.showAll) {
      return supabase.from('todo').select().eq('author', params?.author);
    }

    return supabase
      .from('todo')
      .select()
      .eq('author', params?.author)
      .eq('isDone', false)
      .or(`created_at.gte.${startOfDayISO},isRecurring.eq.true`);
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
