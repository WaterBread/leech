import Attribute from 'interfaces/Attribute';

export const path: Attribute = ({
  xmlName: 'f.path=',
  apiName: 'filePath'
});

export const pathComponents: Attribute = ({
  xmlName: 'f.path_components=',
  apiName: 'filePathComponents'
});

export const priority: Attribute = ({
  xmlName: 'f.priority=',
  apiName: 'priority'
});

export const sizeBytes: Attribute = ({
  xmlName: 'f.size_bytes=',
  apiName: 'sizeBytes'
});

export const sizeChunks: Attribute = ({
  xmlName: 'f.size_chunks=',
  apiName: 'sizeChunks'
});

export const completedChunks: Attribute = ({
  xmlName: 'f.completed_chunks=',
  apiName: 'completedChunks'
});
