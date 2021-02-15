import './index.css';

import { changeSelectedTorrents, addSelectedTorrents, removeSelectedTorrents } from 'actions/toolbar';
import clsx from 'clsx';
import { MappedTorrent } from 'interfaces/torrent';
import { TorrentStatues } from 'interfaces/torrentStatusSummary';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListChildComponentProps, VariableSizeList } from 'react-window';
import { getSearchTerm, getSelectedTorrents, getTorrentStatusFilter, getTorrentTrackerFilter } from 'selectors/toolbar';
import { getAllTorrents, isTorrentsLoading } from 'selectors/torrents';

import {
  CircularProgress,
  makeStyles,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@material-ui/core';

import MimeTypeIcon from './MimeTypeIcon';

import Handle from './Handle';
import ProgressBar from './ProgressBar';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    // overflow: 'auto',
  },
  body: {
    overflow: 'auto',
    display: 'initial',
  },
  cell: {
    alignItems: 'center',
    boxSizing: 'border-box',
    position: 'relative',
    alignSelf: 'center',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    padding: 'unset',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(3),
    display: 'flex',
  },
  overflow: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  handle: {
    display: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  row: {
    color: theme.palette.getContrastText(theme.palette.background.default),
    width: 'unset',
    display: 'flex',
    flexDirection: 'row',
  },
  'row--error': {
    color: theme.palette.error.main,
  },
  'row--stopped': {},
  'row--rechecking': {},
  rowHead: {
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    left: 0,
    right: 0,
    // display: 'flex',
  },
  cellHead: {
    whiteSpace: 'nowrap',
    flex: 1,
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(5),
  },
}));

const columns = [
  {
    id: 'name',
    header: <Typography variant="caption">Name</Typography>,
    width: 1000,
    cell: (row: MappedTorrent) => row.filename,
  },
  {
    id: 'percentComplete',
    header: <Typography variant="caption">Percent Completed</Typography>,
    width: 128,
    cell: (row: MappedTorrent) => {
      const progressComponent = <ProgressBar torrent={row} />;
      return progressComponent;
    },
  },
  {
    id: 'status',
    header: <Typography variant="caption">Status</Typography>,
    width: 128,
    cell: (row: MappedTorrent) => row.status,
  },
  {
    id: 'downloadRate',
    header: <Typography variant="caption">Download Rate</Typography>,
    width: 128,
    cell: (row: MappedTorrent) => row.downloadRate,
  },
  {
    id: 'uploadRate',
    header: <Typography variant="caption">Upload Rate</Typography>,
    width: 128,
    cell: (row: MappedTorrent) => row.uploadRate,
  },
  {
    id: 'completed',
    header: <Typography variant="caption">Completed</Typography>,
    width: 128,
    cell: (row: MappedTorrent) => row.completedBytes,
  },
  {
    id: 'sizeBytes',
    header: <Typography variant="caption">Total</Typography>,
    width: 128,
    cell: (row: MappedTorrent) => row.sizeBytes,
  },
  {
    id: 'private',
    header: <Typography variant="caption">Private</Typography>,
    width: 128,
    cell: (row: MappedTorrent) => row.isPrivate,
  },
];

const TorrentList = () => {
  const filterTableRowsByTracker = (rows: MappedTorrent[], tracker: string) => {
    if (!tracker) return rows;
    return rows.filter(row => row.trackers.includes(tracker));
  };

  const filterTableRowsByTerm = (rows: MappedTorrent[], searchTerm: string) => {
    if (!searchTerm) return rows;
    return rows.filter(row => row.filename.includes(searchTerm));
  };

  const filterTableRowsByStatus = (rows: MappedTorrent[], status: TorrentStatues) => {
    if (status === TorrentStatues.ALL) return rows;

    return rows.filter(row => {
      switch (status) {
        case TorrentStatues.RECHECKING:
          return row.isHashing;
        case TorrentStatues.DOWNLOADING:
          return row.isDownloading;
        case TorrentStatues.UPLOADING:
          return row.isUploading;
        case TorrentStatues.STOPPED:
          return row.isStopped;
        case TorrentStatues.COMPLETED:
          return row.isComplete;
        case TorrentStatues.ERROR:
          return row.isError;
      }
    });
  };
  const classes = useStyles();
  const theme = useTheme();

  const ROW_HEIGHT = theme.spacing(7);

  const torrents = useSelector(getAllTorrents);
  const isLoading = useSelector(isTorrentsLoading);

  const dispatch = useDispatch();

  const [columnWidths, setColumnWidths] = useState<{ [key: number]: number }>(
    columns.reduce((prev, col, idx) => ({ ...prev, [idx]: col.width }), {}),
  );
  const [headerRef, setHeaderRef] = useState<Element>();

  const [filteredRows, setFilteredRows] = useState<MappedTorrent[]>(torrents);

  const statusFilter = useSelector(getTorrentStatusFilter);
  const searchTerm = useSelector(getSearchTerm);
  const trackerFilter = useSelector(getTorrentTrackerFilter);

  const selectedTorrents = useSelector(getSelectedTorrents);

  useEffect(() => {
    const statusFilteredRows = filterTableRowsByStatus(torrents, statusFilter);
    const searchFilteredRows = filterTableRowsByTerm(statusFilteredRows, searchTerm);
    const searchFilteredTrackers = filterTableRowsByTracker(searchFilteredRows, trackerFilter);
    setFilteredRows(searchFilteredTrackers);
  }, [statusFilter, searchTerm, torrents, trackerFilter]);

  const Cell = ({ children, width }: { children?: React.ReactNode; width: number }) => {
    const widthStyles = {
      maxWidth: width,
      minWidth: width,
      height: ROW_HEIGHT,
    };

    return (
      <TableCell component="div" className={classes.cell} style={widthStyles}>
        {children}
      </TableCell>
    );
  };

  const HeaderRow = React.useMemo(
    () => (
      <TableHead component="div" ref={((i: Element) => setHeaderRef(i)) as any} className={classes.rowHead}>
        <TableRow component="div" style={{ height: ROW_HEIGHT, display: 'flex' }}>
          {columns.map((column, idx) => {
            return (
              <Cell width={columnWidths[idx]} key={`column-${column.id}`}>
                {column.header}
                <Handle
                  onChange={(resizedWidth: number) => {
                    let newWidth = resizedWidth + columnWidths[idx];
                    if (newWidth < 50) newWidth = 50;
                    setColumnWidths({ ...columnWidths, [idx]: newWidth });
                    return false;
                  }}
                />
              </Cell>
            );
          })}
          <Cell width={17}></Cell>
        </TableRow>
      </TableHead>
    ),
    [ROW_HEIGHT, classes.rowHead, columnWidths],
  );

  if (isLoading) {
    return (
      <div className={classes.loadingSpinner}>
        <CircularProgress />
      </div>
    );
  }

  const Row = ({ index, style }: ListChildComponentProps) => {
    const row = filteredRows[index];
    const isSelected = selectedTorrents.some(torrent => torrent.hash === row.hash);

    return (
      <TableRow
        className={clsx(classes.row, {
          [classes['row--error']]: row.isError,
          [classes['row--stopped']]: row.isStopped,
        })}
        component="div"
        style={style}
        selected={isSelected}
        onMouseDown={(event: React.MouseEvent) => {
          event.preventDefault();
          if (isSelected) {
            if (event.ctrlKey || event.shiftKey) {
              dispatch(removeSelectedTorrents([row.hash]));
            } else {
              dispatch(changeSelectedTorrents(undefined));
            }
          } else {
            if (event.ctrlKey) {
              dispatch(addSelectedTorrents([row.hash]));
            } else if (event.shiftKey && selectedTorrents.length > 0) {
              // TODO: My selected torrents doesnt keep the index...
              dispatch(addSelectedTorrents([row.hash]));
            } else {
              dispatch(changeSelectedTorrents([row.hash]));
            }
          }
        }}
      >
        {columns.map((column, columnIndex) => {
          return (
            <Cell key={`${column.id}-${row.hash}`} width={columnWidths[columnIndex]}>
              {columnIndex === 0 && <MimeTypeIcon fileName={row.filename} />}
              {column.cell(row)}
            </Cell>
          );
        })}
      </TableRow>
    );
  };

  return (
    <div style={{ flex: '1 1 auto' }}>
      <AutoSizer>
        {({ width, height }) => (
          <Table
            onScroll={(e: SyntheticEvent<HTMLDivElement>) => {
              if (headerRef) {
                // e.target doesn't have the correct type, but currentTarget does (?)
                headerRef.scrollLeft = (e.target as typeof e.currentTarget).scrollLeft;
              }
            }}
            style={{ width: '100%', position: 'relative' }}
            component="div"
          >
            {HeaderRow}
            <VariableSizeList
              height={height - ROW_HEIGHT}
              width={width}
              itemCount={filteredRows.length}
              style={{ top: ROW_HEIGHT }}
              itemSize={() => ROW_HEIGHT}
            >
              {Row}
            </VariableSizeList>
          </Table>
        )}
      </AutoSizer>
    </div>
  );
};

export default TorrentList;
