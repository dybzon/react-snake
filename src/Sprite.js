import React from 'react';
import styled from 'styled-components';
import { shake, colorFade } from './animations';

export class Sprite extends React.PureComponent {
  render() {
    return <SpriteContainer {...this.props}/>;
  }
}

const SpriteContainer = styled.div.attrs({
  style: ({ x, y, pixelSize, timeLeftInSeconds }) => ({
    top: `${y * pixelSize - pixelSize}px`,
    left: `${x * pixelSize - pixelSize}px`,
    opacity: timeLeftInSeconds / 10,
  })
})`
  position: fixed;
  width: ${props => props.pixelSize}px;
  height: ${props => props.pixelSize}px;
  border-radius: 3px;
  animation: ${shake} .8s linear;
`;
