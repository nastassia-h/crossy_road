import { Lane } from "./models3d";
import { scene } from "./scene";

const zoom = 2;
const positionWidth = 42;

export const generateLanes = () => [-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9].map((index) => {
   const lane = new Lane(index);
   lane.mesh.position.y = index*positionWidth*zoom;
   scene.add( lane.mesh );
   return lane;
}).filter((lane) => lane.index >= 0);
 
export const addLane = (lanes) => {
   const index = lanes.length;
   const lane = new Lane(index);
   lane.mesh.position.y = index*positionWidth*zoom;
   scene.add(lane.mesh);
   lanes.push(lane);
}
