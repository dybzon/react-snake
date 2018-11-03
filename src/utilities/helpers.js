// Get the snake part which is currently the head of the snake
export function getSnakeHead(state) {
  return state.snakeParts.find(s => s.partNumber === state.lastSnakePartNumber);
}

// Determine whether the snake head is overlapping another part of the snake
export function headOverlappingBody(state) {
  const head = getSnakeHead(state);
  const otherParts = state.snakeParts.filter(p => p.partNumber !== state.lastSnakePartNumber);
  if(otherParts.length === 0) {
    return false;
  }

  const coordinates = otherParts
    .map(s => getCoordinatesForSnakePart(s))
    .reduce(flatten);
  return coordinates.findIndex(c => c.x === head.headCoordinates.x && c.y === head.headCoordinates.y) > -1;  
}

// Get an array of coordinates for a snake part
function getCoordinatesForSnakePart(snakePart) {
  let coordinates = [];
  for(var i = 0; i < snakePart.length; i++) {
    if(snakePart.movementDirection === 'right') {
      coordinates.push({ x: snakePart.headCoordinates.x - i, y: snakePart.headCoordinates.y });
    }
    if(snakePart.movementDirection === 'left') {
      coordinates.push({ x: snakePart.headCoordinates.x + i, y: snakePart.headCoordinates.y });
    }
    if(snakePart.movementDirection === 'up') {
      coordinates.push({ x: snakePart.headCoordinates.x, y: snakePart.headCoordinates.y + i });
    }
    if(snakePart.movementDirection === 'down') {
      coordinates.push({ x: snakePart.headCoordinates.x, y: snakePart.headCoordinates.y - i });
    }
  }
  return coordinates;
}

// Helper function to flatten an array
function flatten(a,b){return a.concat(b);}
