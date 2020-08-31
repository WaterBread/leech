import { TOGGLE_CONTEXT_MENU } from 'actions/contextMenu';

const initialState = {
  isOpen: false,
};

export default (state: {} = initialState, action: any) => {
  switch (action.type) {
    case TOGGLE_CONTEXT_MENU:
      return {
        ...state,
        isOpen: action.isOpen,
        context: action.context,
      };

    default:
      return state;
  }
};
