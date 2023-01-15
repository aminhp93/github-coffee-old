import request from '@/services/request';
import { useEffect } from 'react';

export function useTag() {
  useEffect(() => {
    request({
      method: 'GET',
      url: 'http://localhost:8000/api/tags/',
    });
  }, []);

  return null;
}
