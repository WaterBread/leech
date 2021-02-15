import React from 'react';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import FileCopy from '@material-ui/icons/FileCopy';
import ArchiveIcon from '@material-ui/icons/Archive';
import MovieIcon from '@material-ui/icons/Movie';
import AlbumIcon from '@material-ui/icons/Album';

interface Props {
  fileName: string;
}

const getExtention = (fileName: string) => {
  return fileName.split('.').pop();
};

const MimeTypeIcon = ({ fileName }: Props) => {
  const extention = getExtention(fileName);

  switch (extention) {
    case 'epub':
    case 'mobi':
    case 'azw3':
    case 'pdf':
      return <MenuBookIcon />;
    case 'zip':
    case 'rar':
    case '7z':
      return <ArchiveIcon />;
    case 'mkv':
    case 'avi':
      return <MovieIcon />;
    case 'iso':
      return <AlbumIcon />;
    default:
      return <FileCopy />;
  }
};

export default MimeTypeIcon;
