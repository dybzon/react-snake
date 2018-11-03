import * as React from 'react';
import { SnakePart } from './SnakePart';

export const Snake = props => {
  const snakeHeadPartNumber = Math.max(...props.snakeParts.map(s => s.partNumber));
  const snakeTailPartNumber = Math.min(...props.snakeParts.map(s => s.partNumber));
  return (props.snakeParts 
    ? props.snakeParts.map(snakePart => 
      <SnakePart 
        {...snakePart}
        pixelSize={props.pixelSize}
        isHeadOverlappingBody={props.isHeadOverlappingBody}
        isHead={snakePart.partNumber === snakeHeadPartNumber}
        isTail={snakePart.partNumber === snakeTailPartNumber}
        key={snakePart.partNumber} />) 
    : null);
}