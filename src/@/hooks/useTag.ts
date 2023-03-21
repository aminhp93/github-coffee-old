import axios from 'axios';
import { useEffect } from 'react';

export function useTag() {
  useEffect(() => {
    axios({
      method: 'GET',
      url: 'http://localhost:8000/api/tags/',
    });
  }, []);

  return null;
}
