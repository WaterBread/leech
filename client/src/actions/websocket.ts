export const socketConnect = (host: string) => ({ type: 'WS_CONNECT', host });
export const socketDisconnect = (host: string) => ({ type: 'WS_DISCONNECT', host });

export const socketConnected = (host: string) => ({ type: 'WS_CONNECTED', host });
export const socketDisconnected = () => ({ type: 'WS_DISCONNECTED' });
