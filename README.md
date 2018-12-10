# react-snake-overlay
A react component that renders a snake game that spans the entire browser window.

The snake game will be rendered on top of any other elements, but will not stop the user from interacting with elements in the background.

# Installation
```
npm i react-snake-overlay --save
```

# Usage
Import the snake component and render it anywhere in your application:

```
// Import the snake component
import Snake from 'react-snake-overlay';
...

// Render it
render() {
  return <Snake />
}
```

## Game controls
a: left
s: down
d: right
w: up
space: pause game

## Customization
The `<Snake />` component takes a number of optional props. 

The default props are:
```
SnakeGame.defaultProps = {
  pixelSize: 20, // The size of each "pixel" in the snake game.
  gameDetailsDisplay: {
    score: true, // Determines whether to display the score (number of sprites eaten).
    lengthMoved: false, // Determines whether to display the length moved.
    lives: true, // Determines whether to display the number of lives left.
    controls: true, // Determines whether to display the game controls.
  }, 
  onGameOver: () => {}, // Called when the game ends
  gameSpeed: 100, // Milliseconds per "increment" in the game
  spriteSpawnRate: 10000, // How often should we (at least) spawn a new sprite. A new sprite will spawn between 0 and X ms after the latest sprite.
  spriteMinlifetime: 10000, // Minimum lifetime of each sprite
  spriteMaxlifetime: 40000, // Maximum lifetime of each sprite,
  spriteContent: [<img src={mouseHead} />, <img src={mouse} />], // The content of the sprite. Should be an array. The content of each sprite will be picked at random at runtime.
};
```

# Technical notes
This component uses `<div>`-elements with `position: fixed` rather than a `<canvas>`. This allows the snake game to span the entire screen and have its elements stay on top, without stopping the user from interacting with elements in the background (e.g. clicking menu items).
