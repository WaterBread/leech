import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

const Style = styled.div`
  width: 100%;
`;

const Content = ({ children }: Props): JSX.Element => {
  return <Style>{children}</Style>;
};

export default Content;
