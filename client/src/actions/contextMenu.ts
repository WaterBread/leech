export const TOGGLE_CONTEXT_MENU = 'OPEN_CONTEXT_MENU';

export const toggleContextMenu = (isOpen = true) => {
  return {
    type: TOGGLE_CONTEXT_MENU,
    isOpen,
  };
};
