import React, { useEffect, ReactElement, useRef } from 'react';

interface Props {
  url: string;
  onMessage: (msg: any) => any;
}

const WebsocketWrapper = ({ onMessage, url }: Props) => {
  const ws = useRef(null as WebSocket | null);

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onopen = () => console.log('ws opened');
    ws.current.onclose = () => console.log('ws closed');
    ws.current.onmessage = (e: MessageEvent) => {
      onMessage(JSON.parse(e.data));
    };

    return () => {
      if (ws.current) {
        ws.current.onmessage = null;
        ws.current.close();
      }
    };
  });
  return <></>;
};

export default WebsocketWrapper;
