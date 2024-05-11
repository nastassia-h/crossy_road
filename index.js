import { Chicken } from './js/models3d';
import { 
  camera, 
  renderer, 
  scene, 
  dirLight, 
  initialCameraPositionY, 
  initialDirLightPositionX, 
  initialDirLightPositionY, 
  initialCameraPositionX 
} from './js/scene';
import { addLane, generateLanes } from './js/laneUtils';

const counterDOM = document.getElementById('counter');  
const endDOM = document.getElementById('end');  

// CONSTS
const zoom = 2;
const chickenSize = 15;
const positionWidth = 42;
const columns = 17;
const boardWidth = positionWidth*columns;

const stepTime = 200; // Miliseconds it takes for the chicken to take a step 

let lanes;
let currentLane;
let currentColumn;

let previousTimestamp;
let startMoving;
let moves;
let stepStartTimestamp;

let gameover = false;

const chicken = new Chicken();
scene.add( chicken );

const initaliseValues = () => {
  lanes = generateLanes()

  currentLane = 0;
  currentColumn = Math.floor(columns/2);

  previousTimestamp = null;

  startMoving = false;
  moves = [];
  stepStartTimestamp;

  chicken.position.x = 0;
  chicken.position.y = 0;

  camera.position.y = initialCameraPositionY;
  camera.position.x = initialCameraPositionX;

  dirLight.position.x = initialDirLightPositionX;
  dirLight.position.y = initialDirLightPositionY;
  dirLight.target = chicken;
}

initaliseValues();

document.querySelector("#retry").addEventListener("click", () => {
  endDOM.style.visibility = 'hidden';
  counterDOM.innerHTML = 0;
  gameover = false;
});

document.getElementById('forward').addEventListener("click", () => move('forward'));

document.getElementById('backward').addEventListener("click", () => move('backward'));

document.getElementById('left').addEventListener("click", () => move('left'));

document.getElementById('right').addEventListener("click", () => move('right'));

window.addEventListener("keydown", event => {
  if (event.key == 'ArrowUp') {
    // up arrow
    move('forward');
  }
  else if (event.key == 'ArrowDown') {
    // down arrow
    move('backward');
  }
  else if (event.key == 'ArrowLeft') {
    // left arrow
    move('left');
  }
  else if (event.key == 'ArrowRight') {
    // right arrow
    move('right');
  }
});

window.addEventListener("keyup", event => {
   if (
      event.key == 'ArrowUp' || 
      event.key == 'ArrowDown' || 
      event.key == 'ArrowLeft' || 
      event.key == 'ArrowRight'
   ) {
     move('stop');
   }
 });

function move(direction) {
   if (gameover) return;
   if (direction === 'stop') {
      moves = moves.slice(0,1);
      return;
   }

  const finalPositions = moves.reduce((position,move) => {
    if(move === 'forward') return {lane: position.lane+1, column: position.column};
    if(move === 'backward') return {lane: position.lane-1, column: position.column};
    if(move === 'left') return {lane: position.lane, column: position.column-1};
    if(move === 'right') return {lane: position.lane, column: position.column+1};
  }, {lane: currentLane, column: currentColumn})

  if (direction === 'forward') {
    if(lanes[finalPositions.lane+1].type === 'forest' && lanes[finalPositions.lane+1].occupiedPositions.has(finalPositions.column)) return;
    if(!stepStartTimestamp) startMoving = true;
    addLane(lanes);
  }
  else if (direction === 'backward') {
    if(finalPositions.lane === 0) return;
    if(lanes[finalPositions.lane-1].type === 'forest' && lanes[finalPositions.lane-1].occupiedPositions.has(finalPositions.column)) return;
    if(!stepStartTimestamp) startMoving = true;
  }
  else if (direction === 'left') {
    if(finalPositions.column === 0) return;
    if(lanes[finalPositions.lane].type === 'forest' && lanes[finalPositions.lane].occupiedPositions.has(finalPositions.column-1)) return;
    if(!stepStartTimestamp) startMoving = true;
  }
  else if (direction === 'right') {
    if(finalPositions.column === columns - 1 ) return;
    if(lanes[finalPositions.lane].type === 'forest' && lanes[finalPositions.lane].occupiedPositions.has(finalPositions.column+1)) return;
    if(!stepStartTimestamp) startMoving = true;
  }
  moves.push(direction);
}

function gameOver() {
   gameover = true;
   endDOM.style.visibility = 'visible';
   lanes.forEach(lane => scene.remove( lane.mesh ));
   initaliseValues();
}

function animate(timestamp) {
  requestAnimationFrame( animate );

  if(!previousTimestamp) previousTimestamp = timestamp;
  const delta = timestamp - previousTimestamp;
  previousTimestamp = timestamp;

  // Animate cars and trucks moving on the lane
  lanes.forEach(lane => {
    if(lane.type === 'car' || lane.type === 'truck') {
      const aBitBeforeTheBeginingOfLane = -boardWidth*zoom/2 - positionWidth*3*zoom;
      const aBitAfterTheEndOFLane = boardWidth*zoom/2 + positionWidth*3*zoom;
      lane.vechicles.forEach(vechicle => {
        if(lane.direction) {
          vechicle.position.x = vechicle.position.x < aBitBeforeTheBeginingOfLane ? aBitAfterTheEndOFLane : vechicle.position.x -= lane.speed/16*delta;
        }else{
          vechicle.position.x = vechicle.position.x > aBitAfterTheEndOFLane ? aBitBeforeTheBeginingOfLane : vechicle.position.x += lane.speed/16*delta;
        }
      });
    }
  });

  if(startMoving) {
    stepStartTimestamp = timestamp;
    startMoving = false;
  }

  if(stepStartTimestamp) {
    const moveDeltaTime = timestamp - stepStartTimestamp;
    const moveDeltaDistance = Math.min(moveDeltaTime/stepTime,1)*positionWidth*zoom;
    const jumpDeltaDistance = Math.sin(Math.min(moveDeltaTime/stepTime,1)*Math.PI)*8*zoom;
    switch(moves[0]) {
      case 'forward': {
        const positionY = currentLane*positionWidth*zoom + moveDeltaDistance;
        camera.position.y = initialCameraPositionY + positionY; 
        dirLight.position.y = initialDirLightPositionY + positionY; 
        chicken.position.y = positionY; // initial chicken position is 0

        chicken.position.z = jumpDeltaDistance;
        break;
      }
      case 'backward': {
        const positionY = currentLane*positionWidth*zoom - moveDeltaDistance
        camera.position.y = initialCameraPositionY + positionY;
        dirLight.position.y = initialDirLightPositionY + positionY; 
        chicken.position.y = positionY;

        chicken.position.z = jumpDeltaDistance;
        break;
      }
      case 'left': {
        const positionX = (currentColumn*positionWidth+positionWidth/2)*zoom -boardWidth*zoom/2 - moveDeltaDistance;
        camera.position.x = initialCameraPositionX + positionX;     
        dirLight.position.x = initialDirLightPositionX + positionX; 
        chicken.position.x = positionX; // initial chicken position is 0
        chicken.position.z = jumpDeltaDistance;
        break;
      }
      case 'right': {
        const positionX = (currentColumn*positionWidth+positionWidth/2)*zoom -boardWidth*zoom/2 + moveDeltaDistance;
        camera.position.x = initialCameraPositionX + positionX;       
        dirLight.position.x = initialDirLightPositionX + positionX;
        chicken.position.x = positionX; 

        chicken.position.z = jumpDeltaDistance;
        break;
      }
    }
    // Once a step has ended
    if(moveDeltaTime > stepTime) {
      switch(moves[0]) {
        case 'forward': {
          currentLane++;
          counterDOM.innerHTML = currentLane;    
          break;
        }
        case 'backward': {
          currentLane--;
          counterDOM.innerHTML = currentLane;    
          break;
        }
        case 'left': {
          currentColumn--;
          break;
        }
        case 'right': {
          currentColumn++;
          break;
        }
      }
      moves.shift();
      stepStartTimestamp = moves.length === 0 ? null : timestamp;
    }
  }

  // Hit test
  if(lanes[currentLane].type === 'car' || lanes[currentLane].type === 'truck') {
    const chickenMinX = chicken.position.x - chickenSize*zoom/2;
    const chickenMaxX = chicken.position.x + chickenSize*zoom/2;
    const vechicleLength = { car: 60, truck: 105}[lanes[currentLane].type]; 
    lanes[currentLane].vechicles.forEach(vechicle => {
      const carMinX = vechicle.position.x - vechicleLength*zoom/2;
      const carMaxX = vechicle.position.x + vechicleLength*zoom/2;
      if(chickenMaxX > carMinX && chickenMinX < carMaxX) {
        gameOver();
      }
    });

  }

   // Drawn test
   if(lanes[currentLane].type === 'river' && !lanes[currentLane].occupiedPositions.has(currentColumn)) {
      gameOver();
   }
   
   renderer.render( scene, camera );	
}

requestAnimationFrame( animate );

export {chickenSize, zoom, positionWidth, columns};