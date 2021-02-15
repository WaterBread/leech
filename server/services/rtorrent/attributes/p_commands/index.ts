import { InputParameter } from 'services/rtorrent/interfaces';

// eslint-disable-next-line max-len
type Keys = 'id' | 'port' | 'address' | 'banned' | 'setBanned' | 'clientVersion' | 'completedPercent' | 'disconnect' | 'disconnectDelayed' | 'downRate' | 'downTotal' | 'peerRate' | 'peerTotal' | 'isSnubbed' | 'setSnubbed' | 'upRate' | 'upTotal';

const Attributes: Record<Keys, InputParameter> = {
  id: { xmlName: 'p.id=', apiName: 'id' },
  port: { xmlName: 'p.port=', apiName: 'port' },
  address: { xmlName: 'p.address=', apiName: 'address' },
  banned: { xmlName: 'p.banned=', apiName: 'banned' },
  setBanned: { xmlName: 'p.banned.set=', apiName: 'setBanned' },
  clientVersion: { xmlName: 'p.client_version=', apiName: 'clientVersion' },
  completedPercent: { xmlName: 'p.completed_percent=', apiName: 'completedPercent' },
  disconnect: { xmlName: 'p.disconnect=', apiName: 'disconnect' },
  disconnectDelayed: { xmlName: 'p.disconnect_delayed=', apiName: 'disconnectDelayed' },
  downRate: { xmlName: 'p.down_rate=', apiName: 'downRate' },
  downTotal: { xmlName: 'p.down_total=', apiName: 'downTotal' },
  peerRate: { xmlName: 'p.peer_rate=', apiName: 'peerRate' },
  peerTotal: { xmlName: 'p.peer_total=', apiName: 'peerTotal' },
  isSnubbed: { xmlName: 'p.is_snubbed=', apiName: 'isSnubbed' },
  setSnubbed: { xmlName: 'p.snubbed.set=', apiName: 'setSnubbed' },
  upRate: { xmlName: 'p.up_rate=', apiName: 'upRate' },
  upTotal: { xmlName: 'p.up_total=', apiName: 'upTotal' }
};

export default Attributes;
