import React from 'react';
import PlusIcon from '@ant-design/icons/PlusSquareOutlined';

interface Props {
  onClick: () => void;
}

const Add = ({ onClick }: Props) => {
  return (
    <a onClick={onClick}>
      <PlusIcon />
    </a>
  );
};

export default Add;
