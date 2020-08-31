import React from 'react';
// import { Menu } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { isContextMenuOpen } from 'selectors/contextMenu';
import { toggleContextMenu } from 'actions/contextMenu';

interface Props {
  trigger: React.ReactNode;
}

const ContextMenuWrapper = ({ trigger }: Props) => {
  const isOpen = useSelector(isContextMenuOpen);
  const dispatch = useDispatch();

  return (
    <></>
    // <Popup trigger={trigger} onClose={() => dispatch(toggleContextMenu(false))} open={isOpen}>
    //   <Menu
    //     items={[
    //       { key: 'open', content: 'Open file', icon: 'file' },
    //       { key: 'save', content: 'Save file', icon: 'box' },
    //     ]}
    //     secondary
    //     vertical
    //   />
    // </Popup>
  );
};

export default ContextMenuWrapper;
