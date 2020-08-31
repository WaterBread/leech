import get from 'lodash/get';

export const isContextMenuOpen = (state: any) => {
  return get(state, 'contextMenu.isOpen', false);
};
