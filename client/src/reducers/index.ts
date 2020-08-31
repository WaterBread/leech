import { combineReducers } from 'redux';

import torrents from './torrents';
import toolbar from './toolbar';
import contextMenu from './contextMenu';
import filelist from './filelist';
import settings from './settings';

export { torrents, toolbar, contextMenu, filelist, settings };
export default combineReducers({ torrents, toolbar, contextMenu, filelist, settings });
