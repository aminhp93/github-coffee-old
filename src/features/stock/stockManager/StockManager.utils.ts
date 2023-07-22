/* eslint-disable @typescript-eslint/no-explicit-any */

export const getRowClass = (params: any) => {
  if (params.node.data.danger) {
    return 'danger-row';
  }
};
