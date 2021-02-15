import { get } from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AddTorrentModal from 'components/AddTorrentModal';
import Page from 'components/Page';
import Toolbar from 'components/Toolbar';
import TorrentList from 'components/TorrentList';
import WebSocket from 'components/WebSocket';
import { GET_TORRENT_LIST_SUCCESS } from 'actions/torrents';
import DeleteTorrentModal from 'components/DeleteTorrentModal';
import { isAddModalOpen as isAddModalOpenSelector } from 'selectors/toolbar';
import { isDeleteModalOpen as isDeleteModalOpenSelector } from 'selectors/toolbar';
import SettingsModal from 'components/SettingsModal';

const Dashboard = (): JSX.Element => {
  const dispatch = useDispatch();

  const isAddModalOpen = useSelector(isAddModalOpenSelector);
  const isDeleteModalOpen = useSelector(isDeleteModalOpenSelector);

  return (
    <Page isLoading={false}>
      {isAddModalOpen && <AddTorrentModal />}
      {isDeleteModalOpen && <DeleteTorrentModal />}
      <SettingsModal />

      <Toolbar />

      <WebSocket
        url={`ws://${process.env.REACT_APP_API_URL}/torrentlist`}
        onMessage={(data: any) => {
          dispatch({ type: GET_TORRENT_LIST_SUCCESS, payload: data });
        }}
      />
      <TorrentList />
    </Page>
  );
};

export default Dashboard;
