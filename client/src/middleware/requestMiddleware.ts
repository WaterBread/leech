import { RequestAction } from 'interfaces/requestAction';
import { Dispatch, AnyAction } from 'redux';
import networkRequest from 'utils/networkRequest';

const HTTP_ACTION = 'request';

export default () => (next: Dispatch<AnyAction>) => async (action: RequestAction) => {
  if (action[HTTP_ACTION]) {
    const actionInfo = action[HTTP_ACTION];
    next({
      type: `${action.type}_PENDING`,
    });

    try {
      const responseBody = await networkRequest(actionInfo);
      next({
        type: `${action.type}_SUCCESS`,
        payload: responseBody,
      });
    } catch (err) {
      next({
        type: `${action.type}_FAILED`,
        payload: err,
      });
    }
  } else {
    return next(action);
  }
};
