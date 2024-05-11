import * as THREE from 'three';

const positionWidth = 42;
const columns = 17;
const boardWidth = positionWidth*columns;
const zoom = 2;

const chickenSize = 15;

const laneTypes = ['car', 'truck','forest', 'river', 'car', 'truck','forest', 'car', 'truck','forest'];
const laneSpeeds = [2, 2.5, 3];
const vechicleColors = [0xa52523, 0xbdb638, 0x78b14b];
const threeHeights = [20,45,60];

// Textures
function Texture(width, height, rects) {
   const canvas = document.createElement( "canvas" );
   canvas.width = width;
   canvas.height = height;
   const context = canvas.getContext( "2d" );
   context.fillStyle = "#ffffff";
   context.fillRect( 0, 0, width, height );
   context.fillStyle = "rgba(0,0,0,0.6)";  
   rects.forEach(rect => {
     context.fillRect(rect.x, rect.y, rect.w, rect.h);
   });
   return new THREE.CanvasTexture(canvas);
 }

const carFrontTexture = new Texture(40,80,[{x: 0, y: 10, w: 30, h: 60 }]);
const carBackTexture = new Texture(40,80,[{x: 10, y: 10, w: 30, h: 60 }]);
const carRightSideTexture = new Texture(110,40,[{x: 10, y: 0, w: 50, h: 30 }, {x: 70, y: 0, w: 30, h: 30 }]);
const carLeftSideTexture = new Texture(110,40,[{x: 10, y: 10, w: 50, h: 30 }, {x: 70, y: 10, w: 30, h: 30 }]);

const truckFrontTexture = new Texture(30,30,[{x: 15, y: 0, w: 10, h: 30 }]);
const truckRightSideTexture = new Texture(25,30,[{x: 0, y: 15, w: 10, h: 10 }]);
const truckLeftSideTexture = new Texture(25,30,[{x: 0, y: 5, w: 10, h: 10 }]);

export function Wheel() {
   const wheel = new THREE.Mesh( 
   new THREE.BoxGeometry( 12*zoom, 33*zoom, 12*zoom ), 
   new THREE.MeshLambertMaterial( { color: 0x333333, flatShading: true } ) 
   );
   wheel.position.z = 6*zoom;
   return wheel;
}

export function Car() {
   const car = new THREE.Group();
   const color = vechicleColors[Math.floor(Math.random() * vechicleColors.length)];
   
   const main = new THREE.Mesh(
   new THREE.BoxGeometry( 60*zoom, 30*zoom, 15*zoom ), 
   new THREE.MeshPhongMaterial( { color, flatShading: true } )
   );
   main.position.z = 12*zoom;
   main.castShadow = true;
   main.receiveShadow = true;
   car.add(main)
   
   const cabin = new THREE.Mesh(
   new THREE.BoxGeometry( 33*zoom, 24*zoom, 12*zoom ), 
   [
      new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true, map: carBackTexture } ),
      new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true, map: carFrontTexture } ),
      new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true, map: carRightSideTexture } ),
      new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true, map: carLeftSideTexture } ),
      new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true } ), // top
      new THREE.MeshPhongMaterial( { color: 0xcccccc, flatShading: true } ) // bottom
   ]
   );
   cabin.position.x = 6*zoom;
   cabin.position.z = 25.5*zoom;
   cabin.castShadow = true;
   cabin.receiveShadow = true;
   car.add( cabin );
   
   const frontWheel = new Wheel();
   frontWheel.position.x = -18*zoom;
   car.add( frontWheel );

   const backWheel = new Wheel();
   backWheel.position.x = 18*zoom;
   car.add( backWheel );

   car.castShadow = true;
   car.receiveShadow = false;
   
   return car;  
}

export function Truck() {
   const truck = new THREE.Group();
   const color = vechicleColors[Math.floor(Math.random() * vechicleColors.length)];


   const base = new THREE.Mesh(
   new THREE.BoxGeometry( 100*zoom, 25*zoom, 5*zoom ), 
   new THREE.MeshLambertMaterial( { color: 0xb4c6fc, flatShading: true } )
   );
   base.position.z = 10*zoom;
   truck.add(base)

   const cargo = new THREE.Mesh(
   new THREE.BoxGeometry( 75*zoom, 35*zoom, 40*zoom ), 
   new THREE.MeshPhongMaterial( { color: 0xb4c6fc, flatShading: true } )
   );
   cargo.position.x = 15*zoom;
   cargo.position.z = 30*zoom;
   cargo.castShadow = true;
   cargo.receiveShadow = true;
   truck.add(cargo)

   const cabin = new THREE.Mesh(
   new THREE.BoxGeometry( 25*zoom, 30*zoom, 30*zoom ), 
   [
      new THREE.MeshPhongMaterial( { color, flatShading: true } ), // back
      new THREE.MeshPhongMaterial( { color, flatShading: true, map: truckFrontTexture } ),
      new THREE.MeshPhongMaterial( { color, flatShading: true, map: truckRightSideTexture } ),
      new THREE.MeshPhongMaterial( { color, flatShading: true, map: truckLeftSideTexture } ),
      new THREE.MeshPhongMaterial( { color, flatShading: true } ), // top
      new THREE.MeshPhongMaterial( { color, flatShading: true } ) // bottom
   ]
   );
   cabin.position.x = -40*zoom;
   cabin.position.z = 20*zoom;
   cabin.castShadow = true;
   cabin.receiveShadow = true;
   truck.add( cabin );

   const frontWheel = new Wheel();
   frontWheel.position.x = -38*zoom;
   truck.add( frontWheel );

   const middleWheel = new Wheel();
   middleWheel.position.x = -10*zoom;
   truck.add( middleWheel );

   const backWheel = new Wheel();
   backWheel.position.x = 30*zoom;
   truck.add( backWheel );

   return truck;  
}

export function Three() {
   const three = new THREE.Group();

   const trunk = new THREE.Mesh(
   new THREE.BoxGeometry( 15*zoom, 15*zoom, 20*zoom ), 
   new THREE.MeshPhongMaterial( { color: 0x4d2926, flatShading: true } )
   );
   trunk.position.z = 10*zoom;
   trunk.castShadow = true;
   trunk.receiveShadow = true;
   three.add(trunk);

   const height = threeHeights[Math.floor(Math.random()*threeHeights.length)];

   const crown = new THREE.Mesh(
   new THREE.BoxGeometry( 30*zoom, 30*zoom, height*zoom ), 
   new THREE.MeshLambertMaterial( { color: 0x7aa21d, flatShading: true } )
   );
   crown.position.z = (height/2+20)*zoom;
   crown.castShadow = true;
   crown.receiveShadow = false;
   three.add(crown);

   return three;  
}

export function Leg() {
   const chickenleg = new THREE.Group();

   const leg = new THREE.Mesh(
   new THREE.BoxGeometry( 2*zoom, 2*zoom, 10*zoom ), 
   new THREE.MeshPhongMaterial( { color: 0xFFA500, flatShading: true } )
   );
   leg.position.z = 10*zoom;
   leg.position.y = -zoom;
   leg.castShadow = true;
   leg.receiveShadow = true;
   chickenleg.add(leg);

   const foot = new THREE.Mesh(
   new THREE.BoxGeometry( 5*zoom, 9*zoom, 2*zoom ), 
   new THREE.MeshLambertMaterial( { color: 0xFFA500, flatShading: true } )
   );
   foot.position.z = 4*zoom;
   foot.castShadow = true;
   foot.receiveShadow = false;
   chickenleg.add(foot);

   return chickenleg;  
}

export function Wing() {
   const wing = new THREE.Mesh(
   new THREE.BoxGeometry( 2*zoom, 13*zoom, 7*zoom ), 
   new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } )
   );
   wing.position.z = 20*zoom;
   wing.position.y = -3*zoom;
   wing.castShadow = true;
   wing.receiveShadow = true;

   return wing;  
}

export function Chicken() {
   const chicken = new THREE.Group();

   const body = new THREE.Mesh(
   new THREE.BoxGeometry( chickenSize*zoom, chickenSize*zoom*0.8, 20*zoom ), 
   new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } )
   );
   body.position.z = 25*zoom;
   body.castShadow = true;
   body.receiveShadow = true;
   chicken.add(body);

   const rowel = new THREE.Mesh(
   new THREE.BoxGeometry( 2*zoom, 4*zoom, 2*zoom ), 
   new THREE.MeshLambertMaterial( { color: 0xF0619A, flatShading: true } )
   );

   rowel.position.z = 35*zoom;
   rowel.castShadow = true;
   rowel.receiveShadow = false;
   chicken.add(rowel);

   const leftLeg = new Leg();
   leftLeg.position.x = -5*zoom;
   chicken.add(leftLeg);

   const rightLeg = new Leg();
   rightLeg.position.x = 5*zoom;
   chicken.add(rightLeg);

   const leftWing = new Wing();
   leftWing.position.x = -8*zoom;
   chicken.add(leftWing);

   const rightWing = new Wing();
   rightWing.position.x = 8*zoom;
   chicken.add(rightWing);

   const tail = new THREE.Mesh(
      new THREE.BoxGeometry( 13*zoom, 8*zoom, 7*zoom ), 
      new THREE.MeshLambertMaterial( { color: 0xffffff, flatShading: true } )
   );
   tail.position.z = 20*zoom;
   tail.position.y = -10*zoom;
   tail.castShadow = true;
   tail.receiveShadow = false;
   chicken.add(tail);

   return chicken;  
}

export function Road() {
   const road = new THREE.Group();

   const createSection = color => new THREE.Mesh(
   new THREE.PlaneGeometry( boardWidth*zoom, positionWidth*zoom ), 
   new THREE.MeshPhongMaterial( { color } )
   );

   const middle = createSection(0x454A59);
   middle.receiveShadow = true;
   road.add(middle);

   const left = createSection(0x393D49);
   left.position.x = - boardWidth*zoom;
   road.add(left);

   const right = createSection(0x393D49);
   right.position.x = boardWidth*zoom;
   road.add(right);

   return road;
}

export function Grass() {
   const grass = new THREE.Group();

   const createSection = color => new THREE.Mesh(
   new THREE.BoxGeometry( boardWidth*zoom, positionWidth*zoom, 3*zoom ), 
   new THREE.MeshPhongMaterial( { color } )
   );

   const middle = createSection(0xbaf455);
   middle.receiveShadow = true;
   grass.add(middle);

   const left = createSection(0x99C846);
   left.position.x = - boardWidth*zoom;
   grass.add(left);

   const right = createSection(0x99C846);
   right.position.x = boardWidth*zoom;
   grass.add(right);

   grass.position.z = 1.5*zoom;
   return grass;
}

export function River() {
   const river = new THREE.Group();

   const createSection = color => new THREE.Mesh(
      new THREE.BoxGeometry( boardWidth*zoom, positionWidth*zoom, 3*zoom ), 
      new THREE.MeshPhongMaterial( { color } )
   )

   const middle = createSection(0x68D2E8);
   middle.receiveShadow = true;
   river.add(middle);

   const left = createSection(0x03AED2);
   left.position.x = - boardWidth*zoom;
   river.add(left);

   const right = createSection(0x03AED2);
   right.position.x = boardWidth*zoom;
   river.add(right);

   river.position.z = zoom;
   return river;
}

export function Plot() {
   const plot = new THREE.Mesh( 
      new THREE.BoxGeometry( positionWidth*zoom*0.7, positionWidth*zoom*0.7, 4*zoom ), 
      new THREE.MeshLambertMaterial( { color: 0xA94438, flatShading: true } ) 
      );
      plot.position.z = 1.5*zoom;
      return plot;
}

let prevType = ''

export function Lane(index) {
   this.index = index;
   this.type = '';
   do {
      this.type = index <= 0 ? 'field' : laneTypes[Math.floor(Math.random()*laneTypes.length)];
   } while ((prevType == 'car' || prevType == 'truck' && this.type == 'river') || 
            (this.type == 'car' || this.type == 'truck' && prevType == 'river') ||
            (this.type == 'river' && prevType == 'river'))
   
   prevType = this.type;

   switch(this.type) {
   case 'river': {
      this.type = 'river';
      this.mesh = new River();

      this.occupiedPositions = new Set();
      this.plots = [1,2,3,4,5].map(() => {
         const plot = new Plot();
         let position;
         do {
            position = Math.floor(Math.random()*columns);
         } while(this.occupiedPositions.has(position))
         this.occupiedPositions.add(position);
         plot.position.x = (position*positionWidth+positionWidth/2)*zoom-boardWidth*zoom/2;
         this.mesh.add( plot );
         return plot;
      })
      break;
   }
   case 'field': {
      this.type = 'field';
      this.mesh = new Grass();
      break;
   }
   case 'forest': {
      this.mesh = new Grass();

      this.occupiedPositions = new Set();
      this.threes = [1,2,3,4].map(() => {
         const three = new Three();
         let position;
         do {
         position = Math.floor(Math.random()*columns);
         }while(this.occupiedPositions.has(position))
         this.occupiedPositions.add(position);
         three.position.x = (position*positionWidth+positionWidth/2)*zoom-boardWidth*zoom/2;
         this.mesh.add( three );
         return three;
      })
      break;
   }
   case 'car' : {
      this.mesh = new Road();
      this.direction = Math.random() >= 0.5;

      const occupiedPositions = new Set();
      this.vechicles = [1,2,3].map(() => {
         const vechicle = new Car();
         let position;
         do {
         position = Math.floor(Math.random()*columns/2);
         }while(occupiedPositions.has(position))
         occupiedPositions.add(position);
         vechicle.position.x = (position*positionWidth*2+positionWidth/2)*zoom-boardWidth*zoom/2;
         if(!this.direction) vechicle.rotation.z = Math.PI;
         this.mesh.add( vechicle );
         return vechicle;
      })

      this.speed = laneSpeeds[Math.floor(Math.random()*laneSpeeds.length)];
      break;
   }
   case 'truck' : {
      this.mesh = new Road();
      this.direction = Math.random() >= 0.5;

      const occupiedPositions = new Set();
      this.vechicles = [1,2].map(() => {
         const vechicle = new Truck();
         let position;
         do {
         position = Math.floor(Math.random()*columns/3);
         }while(occupiedPositions.has(position))
         occupiedPositions.add(position);
         vechicle.position.x = (position*positionWidth*3+positionWidth/2)*zoom-boardWidth*zoom/2;
         if(!this.direction) vechicle.rotation.z = Math.PI;
         this.mesh.add( vechicle );
         return vechicle;
      })

      this.speed = laneSpeeds[Math.floor(Math.random()*laneSpeeds.length)];
      break;
   }
   }
}
