import styled from 'styled-components';
import { shake, colorFade } from './animations';
export const Sprite = styled.div.attrs({
  style: ({ x, y, pixelSize, timeLeftInSeconds }) => ({
    top: `${y * pixelSize - pixelSize}px`,
    left: `${x * pixelSize - pixelSize}px`,
    opacity: timeLeftInSeconds > 10 ? 1 : timeLeftInSeconds / 10,
  })
})`
  position: fixed;
  width: ${props => props.pixelSize}px;
  height: ${props => props.pixelSize}px;
  border-radius: 3px;
  animation: ${shake} .8s linear;
`;
