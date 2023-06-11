import { Status } from './types';

export const getStatusColor = (status: Status): string => {
  if (!status) return 'gray';
  if (status.label === 'in_progress') {
    return 'purple';
  } else if (status.label === 'close') {
    return 'green';
  }
  return 'gray';
};
