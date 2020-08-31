import get from 'lodash/get';
import set from 'lodash/set';

import { Torrent } from 'interfaces/torrent';

export const getTrackerSummary = (state: any): any => {
  const torrentList: Torrent[] = get(state, 'torrents.torrentList', []);

  return torrentList.reduce((prev, torrent) => {
    const list = { ...prev };
    torrent.trackers.forEach(tracker => {
      const incr = get(prev, `["${tracker}"]`, 0);
      set(list, `["${tracker}"]`, incr + 1);
    });
    return list;
  }, {});
};
