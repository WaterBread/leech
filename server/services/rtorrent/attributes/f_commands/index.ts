import { InputParameter } from 'services/rtorrent/interfaces';

type Keys = 'path' | 'pathComponents' | 'priority' | 'sizeBytes' | 'sizeChunks' | 'completedChunks';

const Attributes: Record<Keys, InputParameter> = {
  path: { xmlName: 'f.path=', apiName: 'filePath' },
  pathComponents: { xmlName: 'f.path_components=', apiName: 'filePathComponents' },
  priority: { xmlName: 'f.priority=', apiName: 'priority' },
  sizeBytes: { xmlName: 'f.size_bytes=', apiName: 'sizeBytes' },
  sizeChunks: { xmlName: 'f.size_chunks=', apiName: 'sizeChunks' },
  completedChunks: { xmlName: 'f.completed_chunks=', apiName: 'completedChunks' }
};

export default Attributes;
