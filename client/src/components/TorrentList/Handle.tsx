import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Draggable from 'react-draggable';

const useStyles = makeStyles(() => ({
  handle: {
    width: '11px',
    justifyContent: 'center',
    display: 'flex',
    cursor: 'col-resize',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  bar: {
    width: '1px',
    backgroundColor: '#0000001f',
    height: '100%',
  },
  row: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },
}));

interface Props {
  onChange: (distanceDiff: number) => void;
  style?: React.CSSProperties;
}

const Handle = ({ style, onChange }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.row} style={style}>
      <Draggable
        axis="x"
        defaultClassName={'VTColumnResizer'}
        defaultClassNameDragging={'VTColumnResizerActive'}
        onStop={(e, data) => onChange(data.x)}
        position={{
          x: 0,
          y: 0,
        }}
      >
        <div className={classes.handle}>
          <div className={classes.bar} />
        </div>
      </Draggable>
    </div>
  );
};

export default Handle;
