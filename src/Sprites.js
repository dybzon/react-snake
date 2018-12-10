import * as React from 'react';
import { Sprite } from './Sprite';
export const Sprites = props => (props.sprites.map(spriteProps => {
  const currentTime = new Date();
  const timeLeft = spriteProps.spawnTime.getTime() + spriteProps.lifetime - currentTime.getTime();
  let timeLeftInSeconds = Math.round(timeLeft / 1000);
  timeLeftInSeconds = timeLeftInSeconds > 10 ? 10 : timeLeftInSeconds;
  return (
    <Sprite 
      {...spriteProps} 
      pixelSize={props.pixelSize} 
      key={spriteProps.id}
      timeLeftInSeconds={timeLeftInSeconds}>
      {spriteProps.content}
    </Sprite>);
}));
