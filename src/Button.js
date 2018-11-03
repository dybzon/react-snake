import React from 'react';
import styled from 'styled-components';
import { colors } from './colors';

export const Button = props => (
  <StyledButton onClick={props.onClick}>{props.children}</StyledButton>
);

const StyledButton = styled.div`
  width: 100px;
  background-color: ${colors.snakeGreen1};
  border-radius: 5px;
  color: ${colors.spriteGrey};
  transition: background-color .3s linear;

  :hover {
    background-color: ${colors.snakeGreen2};
  }
`;