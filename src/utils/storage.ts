const LOCAL_STORAGE_PREFIX = 'sensor';

export const getLocalStorage = (key: string) =>
  localStorage.getItem(`${LOCAL_STORAGE_PREFIX}.${key}`);

export const setLocalStorage = (key: string, value: any) =>
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}.${key}`, value);

export const removeLocalStorage = (key: any) =>
  localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}.${key}`);

export const removeAllLocalStorage = () => localStorage.clear();
