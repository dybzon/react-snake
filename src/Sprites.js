import * as React from 'react';
import { Sprite } from './Sprite';
export const Sprites = props => (props.sprites.map(spriteProps => {
  const currentTime = new Date();
  const timeLeft = spriteProps.spawnTime.getTime() + spriteProps.lifetime - currentTime.getTime();
  const timeLeftInSeconds = Math.round(timeLeft / 1000);
  return (
    <Sprite 
      {...spriteProps} 
      pixelSize={props.pixelSize} 
      key={spriteProps.id}
      timeLeftInSeconds={timeLeftInSeconds}>
      {spriteProps.content}
    </Sprite>);
}));
