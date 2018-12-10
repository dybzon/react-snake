import * as React from 'react';
import styled from 'styled-components';
import { colors } from './utilities';

/**
 * The game container is a grid spanning from (1, 1) to 
 * (window.innerWidth / pixelSize, window.innerHeight / pixelSize).
 * 
 * I.e. each field in the grid consists of pixelSize * pixelSize pixels.
 * 
 * Each snake part will be rendered inside of this grid, with
 * its "head" at the given coordinates.
 */

export const SnakePart = props => {
  // We want to keep the "head" of each snakepart at the given coordinates
  let calculatedHeadX = props.headCoordinates.x * props.pixelSize;
  let calculatedHeadY = props.headCoordinates.y * props.pixelSize;
  const calculatedLength = props.length * props.pixelSize;

  // We need to add an additional offset to the element (due to the rotation) to keep the snakepart's head at the correct position
  let offsetX = 0;
  let offsetY = 0;

  if(props.movementDirection === 'right') {
    offsetX = -calculatedLength;
    offsetY = -props.pixelSize;
  }

  if(props.movementDirection === 'up') {
    offsetX = -0.5 * (calculatedLength + props.pixelSize);
    offsetY = 0.5 * calculatedLength - 1.5 * props.pixelSize;
  }

  if(props.movementDirection === 'down') {
    offsetX = -0.5 * (calculatedLength + props.pixelSize);
    offsetY = -0.5 * calculatedLength - 0.5 * props.pixelSize;
  }

  if(props.movementDirection === 'left') {
    offsetX = -props.pixelSize;
    offsetY = -props.pixelSize;
  }

  calculatedHeadX += offsetX;
  calculatedHeadY += offsetY;

  const rotationsPerDirection = [
    { direction: 'up', rotation: 270 },
    { direction: 'right', rotation: 0 },
    { direction: 'down', rotation: 90 },
    { direction: 'left', rotation: 180 }
  ];

  const rotation = rotationsPerDirection.find(r => r.direction === props.movementDirection).rotation;

  /**
   * We'll pass the variable styles in as a style object (which will be applied as in-line styles).
   * Otherwise styled-components will create a new class
   * every time the styles are changed. 
   */
  const variableStyles = {
    borderRadius: props.isHead ? '0px 5px 5px 0px' : '0px',
    width: `${calculatedLength}px`,
    height: `${props.pixelSize}px`,
    transform: `translateY(${calculatedHeadY}px) translateX(${calculatedHeadX}px) rotate(${rotation}deg)`,
    backgroundImage: `linear-gradient(
      ${props.isHeadOverlappingBody ? colors.snakeRed : colors.snakeGreen1}, 
      ${props.isHeadOverlappingBody ? colors.snakeYellow : colors.snakeGreen2})`,
  }

  return (
    <SnakePartContainer {...variableStyles}>
    </SnakePartContainer>)
}

const SnakePartContainer = styled.div.attrs({
  style: ({ height, width, borderRadius, transform, backgroundImage }) => ({
    height, width, borderRadius, transform, backgroundImage
  }),
})`
  position: fixed;
`;
