import { keyframes } from 'styled-components';
export const shake = keyframes`
  0%   {transform: rotate(30deg);}
  20%   {transform: rotate(-30deg);}
  40%   {transform: rotate(20deg);}
  60%   {transform: rotate(-20deg);}
  80%   {transform: rotate(10deg);}
  100%   {transform: rotate(0deg);}
`;