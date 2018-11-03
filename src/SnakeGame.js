import * as React from 'react';
import styled from 'styled-components';
import { Snake } from './Snake.js';
import { GameDetails } from './GameDetails';
import { Sprites } from './Sprites';
import { headOverlappingBody, getSnakeHead } from './utilities/helpers';
import mouse from '../assets/mouse.svg';
import mouseHead from '../assets/mouseHead.svg';

const validInputKeyCodes = [
  87,65,83,68,32 // w, a, s, d, space
];

const defaultHeadCoordinates = { x: 10, y: 10 };
const defaultSnakePart = { 
  headCoordinates: {...defaultHeadCoordinates},
  movementDirection: 'right',
  length: 7,
  partNumber: 1 };
const defaultState = { 
  score: 0,
  lives: 3,
  isHeadOverlappingBody: false,
  snakeMovementDirection: 'right',
  snakeParts: [{...defaultSnakePart}],
  lastSnakePartNumber: 1,
  lengthMoved: 0,
  paused: false,
  sprites: [],
  lastSpriteId: 1,
};

export class SnakeGame extends React.Component {
  constructor(props) {
    super(props);
    const spawnTime = new Date();
    this.state = {
      ...defaultState,
      gameWidthPixels: Math.floor(window.innerWidth / props.pixelSize),
      gameHeightPixels: Math.floor(window.innerHeight / props.pixelSize),
      lastSpriteSpawnTime: spawnTime,
      nextSpriteSpawnTime: spawnTime,
    };
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('keydown', this.handleKeydown);

    // This is what drives the gameplay. 
    setInterval(this.incrementGame, this.props.gameSpeed);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('keydown', this.handleKeydown);
  }

  render() {
    const { score, lengthMoved, paused, lives } = this.state;
    return (
    <SnakeGameContainer>
      {this.props.showGameDetails 
        && <GameDetails {...{score, lengthMoved, paused, lives}} onRestartGame={this.restartGame} />}
      <Sprites sprites={this.state.sprites} pixelSize={this.props.pixelSize} />
      <Snake snakeParts={this.state.snakeParts} pixelSize={this.props.pixelSize} isHeadOverlappingBody={this.state.isHeadOverlappingBody} />
    </SnakeGameContainer>);
  }

  handleKeydown = (e) => {
    if(validInputKeyCodes.includes(e.keyCode)){
      switch(e.keyCode) {
        case 87: // movement direction up
          if(this.state.snakeMovementDirection !== 'up' && this.state.snakeMovementDirection !== 'down') {
            this.changeDirection('up');
          }
        break;
        case 65: // movement direction left
          if(this.state.snakeMovementDirection !== 'left' && this.state.snakeMovementDirection !== 'right') {
            this.changeDirection('left');
          }
        break;
        case 83: // movement direction down
          if(this.state.snakeMovementDirection !== 'down' && this.state.snakeMovementDirection !== 'up') {
            this.changeDirection('down');
          }
        break;
        case 68: // movement direction right
          if(this.state.snakeMovementDirection !== 'right'  && this.state.snakeMovementDirection !== 'left') {
            this.changeDirection('right');
          }
        break;
        default:
          this.pauseGame();
      }
    }
  }

  // The size of the game should match the window size
  handleResize = (e) => {
    this.setState({
      gameWidthPixels: Math.ceil(window.innerWidth / this.props.pixelSize),
      gameHeightPixels: Math.ceil(window.innerHeight / this.props.pixelSize)
    });
  }

  getNextHeadCoordinates(headCoordinates, movementDirection) {
    const nextHeadCoordinates = { x: headCoordinates.x, y: headCoordinates.y };
    switch(movementDirection) {
      case 'up':
        nextHeadCoordinates.y--;
        break;
      case 'left':
        nextHeadCoordinates.x--;
        break;
      case 'down':
        nextHeadCoordinates.y++;
        break;
      case 'right':
        nextHeadCoordinates.x++;
        break;
      default:
        // Do nothing
    }
    
    return nextHeadCoordinates;
  }

  changeDirection = newDirection => {
    this.setState({ snakeMovementDirection: newDirection, });
  }

  pauseGame = () => {
    this.setState({ paused: !this.state.paused});
  }

  incrementGame = () => {
    // We'll only move the snake if the game is not paused
    if(this.state.paused || this.state.lives <= 0) return;

    const newState = this.state;

    // Move the snake
    this.handleSnakeMovement(newState);

    // Handle eating/removing/spawning sprites
    this.handleSpriteUpdates(newState);

    // Handle life loss (when the snake runs into something bad)
    this.handleLifeloss(newState);

    newState.lengthMoved++;
    this.setState(newState);
  }

  handleSnakeMovement = state => {
    this.handleDirectionChange(state);
    this.moveBitFromTailToHead(state);
    this.moveSnakeHeadForward(state);

    // Spawn a new snake head on the opposite side if the snake went off screen
    this.handleOffscreenMovement(state)
  }

  handleSpriteUpdates = state => {
    this.eatSprites(state);
    this.removeDeadSprites(state);
    this.trySpawnSprite(state);
  }

  handleLifeloss = state => {
    if(headOverlappingBody(state)) {
      state.isHeadOverlappingBody = true;
      state.lives = state.lives > 0 ? state.lives - 1 : 0;
    }
    else {
      state.isHeadOverlappingBody = false;
    }    
  }

  handleDirectionChange = state => {
    const snakeHead = getSnakeHead(state);
    // If the direction was changed, then we'll create a new snake head moving in the new direction
    if(this.state.snakeMovementDirection !== snakeHead.movementDirection) {
      const newSnakeHead = this.getNewSnakeHeadAfterDirectionChange(this.state.snakeMovementDirection);
      state.lastSnakePartNumber++;
      state.snakeParts.push(newSnakeHead);
    }    
  }

  handleOffscreenMovement = state => {
    const snakeHead = getSnakeHead(state);
    // Check whether the snake head has left the game container
    if(this.isHeadOffScreen(snakeHead)) {
      // Create a new snakehead at the opposing end of the screen
        const newSnakeHead = this.getNewSnakeHeadAfterMovingOffScreen(snakeHead, state.lastSnakePartNumber + 1);
        state.lastSnakePartNumber++;
  
        // Decrement the previous snake head one bit, as it should not be allowed to move off screen
        snakeHead.length--;
        this.moveSnakePartBackwards(snakeHead);
        state.snakeParts.push(newSnakeHead);
      }  
  }

  moveSnakeHeadForward = state => {
    const snakeHead = getSnakeHead(state);
    this.moveSnakePartForward(snakeHead);
  }

  moveBitFromTailToHead = state => {
    if(state.snakeParts.length > 1) {
      let snakeTail = state.snakeParts[0];
      const snakeHead = getSnakeHead(state);

      // If the snake was turned at the edge of the screen (going off screen), a snake part with length 0 can be spawned
      // This snake part should be removed
      snakeTail.length === 0 && state.snakeParts.splice(0, 1);
      if(state.snakeParts.length === 0) return;

      snakeTail = state.snakeParts[0];

      // Move on bit from the tail to the head
      snakeTail.length--;
      snakeHead.length++;

      // If the tail is gone, remove it
      snakeTail.length <= 0 && state.snakeParts.splice(0, 1);
    }    
  }

  moveSnakePartForward = snakePart => {
    switch(snakePart.movementDirection) {
      case 'up':
        snakePart.headCoordinates.y--;
        break;
      case 'left':
        snakePart.headCoordinates.x--;
        break;
      case 'down':
        snakePart.headCoordinates.y++;
        break;
      case 'right':
        snakePart.headCoordinates.x++;
        break;
      default:
        // Do nothing
    }
  }

  moveSnakePartBackwards = snakePart => {
    switch(snakePart.movementDirection) {
      case 'up':
        snakePart.headCoordinates.y++;
        break;
      case 'left':
        snakePart.headCoordinates.x++;
        break;
      case 'down':
        snakePart.headCoordinates.y--;
        break;
      case 'right':
        snakePart.headCoordinates.x--;
        break;
      default:
        // Do nothing
    }
  }

  isHeadOffScreen = snakeHead => (
    snakeHead.headCoordinates.x > this.state.gameWidthPixels 
    || snakeHead.headCoordinates.y > this.state.gameHeightPixels
    || snakeHead.headCoordinates.x < 1
    || snakeHead.headCoordinates.y < 1);

  getNewSnakeHeadAfterMovingOffScreen = (snakeHead, nextSnakePartNumber) => {
    const newSnakeHeadCoordinates = { ...snakeHead.headCoordinates };

    if(snakeHead.headCoordinates.x > this.state.gameWidthPixels) {
      newSnakeHeadCoordinates.x = 1;
    }
    if(snakeHead.headCoordinates.x < 1) {
      newSnakeHeadCoordinates.x = this.state.gameWidthPixels;
    }
    if(snakeHead.headCoordinates.y > this.state.gameHeightPixels) {
      newSnakeHeadCoordinates.y = 1;
    }
    if(snakeHead.headCoordinates.y < 1) {
      newSnakeHeadCoordinates.y = this.state.gameHeightPixels;
    }

    return {
      headCoordinates: newSnakeHeadCoordinates,
      movementDirection: this.state.snakeMovementDirection,
      length: 1,
      partNumber: nextSnakePartNumber,
    };    
  }

  getNewSnakeHeadAfterDirectionChange = movementDirection => {
    const snakeHead = getSnakeHead(this.state);
    
    return {
      headCoordinates: {...snakeHead.headCoordinates},
      movementDirection,
      length: 0,
      partNumber: this.state.lastSnakePartNumber + 1,
    };
  }

  // Eat any sprites overlapped by the snake head
  eatSprites = state => {
    const snakeHead = state.snakeParts.find(s => s.partNumber === state.lastSnakePartNumber);
    const snakeTail = state.snakeParts[0];
    const spritesToBeEaten = state.sprites
      .filter(s => s.x === snakeHead.headCoordinates.x && s.y === snakeHead.headCoordinates.y);

    if(spritesToBeEaten.length > 0) {
      spritesToBeEaten.forEach(sprite => {
          state.sprites.splice(state.sprites.findIndex(s => s.id === sprite.id), 1);
          state.score++;
          snakeTail.length++;
        });
    }
  }

  removeDeadSprites = state => {
    const currentTime = new Date();
    const validSprites = state.sprites.filter(sprite => (currentTime.getTime() - sprite.spawnTime.getTime()) <= sprite.lifetime);
    state.sprites = validSprites;
  }

  trySpawnSprite = state => {
    const currentTime = new Date();
    if(currentTime > state.nextSpriteSpawnTime) {
      const newSprite = {
        x: Math.ceil(Math.random() * state.gameWidthPixels),
        y: Math.ceil(Math.random() * state.gameHeightPixels),
        id: state.lastSpriteId+1,
        spawnTime: currentTime,
        lifetime: Math.random() * (this.props.spriteMaxlifetime - this.props.spriteMinlifetime) + this.props.spriteMinlifetime,
        content: this.props.spriteContent[Math.floor(this.props.spriteContent.length * Math.random())],
      }
      state.sprites.push(newSprite);
      state.lastSpriteSpawnTime = currentTime;
      state.lastSpriteId++;
      // We'll add some randomness to the spawn rate
      state.nextSpriteSpawnTime = currentTime.getTime() + this.props.spriteSpawnRate * Math.random();
    }
  }

  restartGame = () => {
    defaultSnakePart.headCoordinates = {...defaultHeadCoordinates};
    defaultState.snakeParts = [{...defaultSnakePart}];
    this.setState(defaultState);
  }
}

// These are the default "settings" that can be overwritten through props
SnakeGame.defaultProps = {
  pixelSize: 20, // The size of each "pixel" in the snake game.
  showGameDetails: true, 
  onGameOver: () => {}, // Called when the game ends
  gameSpeed: 100, // Milliseconds per "increment" in the game
  spriteSpawnRate: 10000, // How often should we (at least) spawn a new sprite. A new sprite will spawn between 0 and X ms after the latest sprite.
  spriteMinlifetime: 10000, // Minimum lifetime of each sprite
  spriteMaxlifetime: 40000, // Maximum lifetime of each sprite,
  spriteContent: [<img src={mouseHead} />, <img src={mouse} />], // The content of the sprite. Should be an array. The content of each sprite will be picked at random at runtime.
};

const SnakeGameContainer = styled.div`
  width: 0;
  height: 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;