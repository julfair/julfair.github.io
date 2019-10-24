//formula for spherical projection:
//  x = r * sin(latitude) * cos(longitude)
//  y = r * sin(latitude) * sin(longitude)
//  z = r * cos(latitude)

let amp;
let myLevels = [];
let scaling = false;

let snowflakes = []; 

let resolution = 50;
let r = 100;
let angle = 5;
let counter = 0;
//we are going to use a 2d array to store xyz values
let globe = [];

let addVal=0;
let posNeg = -1;

let fft; 

function preload(){
  

  sound = loadSound('sound.m4a');
 
}


function setup() {
  createCanvas(1920, 1080, WEBGL);
 
 
  
     sound.rate(1.0);
  sound.loop();

  fft = new p5.FFT();
  
  
 globe = fft.analyze();
  
  //initialize 2d array; make an extra value so we don't have an end of array error in our draw loop
  for(let i =0; i < resolution + 1; i++){
      globe[i]=[];

    for(let j = 0; j < resolution + 1; j++){
      globe[i][j] = 0;
  
    }
  }
  
  
  //this nested for loop will do our sphere math so we only do it once
for(let i = 0; i < resolution + 1; i++){

  //map longitude resolution to a range that is a full circle
  let long = map(i, 0, resolution, 0, PI)

  for(let j = 0; j < resolution + 1; j++){
    
    //map latitude resolution to half a circle
    let lat = map(j, 0 , resolution, 0, TWO_PI); 
    

    
    //the equations for generating x,y,z from sin,cos,long,lat,radius
    let x = r * sin(lat) * cos(long);
    let y = r * sin(lat) * sin(long);
    let z =  r * cos(lat);
    
    //fill our 2d array with the generated points, stored as vectors
    globe[i][j] = createVector(x,y,z);
         
  }
}
  
}

function draw() {
  
 let t = frameCount / 60;
  
  background(0);
  camera(0, 0, 800, 0, 0, 0, 0, 1, 0);
  orbitControl();
  rotateX(angle/4);
  
  
  rotateY(2);
  // rotateZ(angle*2*posNeg*5);
  pointLight(250, 250, 250, -200, -100, 200);
  

 for (let i = 0; i < random(2); i++) {
    snowflakes.push(new snowflake()); // append snowflake object
  }
  for (let flake of snowflakes) {
    flake.update(t); // update snowflake position
    flake.display(); // draw snowflake
  }

    
   // using a modulo symbol to make alternating rows different colors
  

  noiseMod = fft.analyze();

  //this nested for loop will draw our shape
  for(let i = 0; i < resolution; i++){
    let long = map(i, 0, resolution, -PI, PI)

    beginShape(TRIANGLE_STRIP)
    
  
      if(i%2 == 0){
      fill(225, 234, 250);
    } else {
      fill(237, 239, 242);
    }
    
    
    
    for(let j = 0; j < resolution+1; j++){
      let lat = map(j, 0 , resolution, -PI, PI); 

      //these are the points of our triangle shapes
      let v1 = new p5.Vector(globe[i][j].x, globe[i][j].y, globe[i][j].z);
       let v2 = new p5.Vector(globe[i+1][j].x, globe[i+1][j].y, globe[i+1][j].z);
      
      //stroke(0);
     // noStroke();
      stroke(120);
      
         // console.log(noiseMod[0]);
     r = r - map(noiseMod[j], 0, 255, 0, 10);
    
    

      //this is where we draw the vertexes.  it's also a great spot to add some       //kind of random value or make them move using trigonometric functions or       //  whatever else!
      if(addVal > 50 || addVal < -100){
        posNeg*=-1
      }
      addVal = posNeg * addVal + map(noise(counter), -1, -0.9, 2.5, -0.1);
      

      rotateZ(addVal)
     
     
     v1.x = v1.x + addVal;
      v1.x = v1.x - 100;
      v1.y = v2.y * addVal/100;
      
      vertex(v1.x, v1.y, v1.z);
      vertex(v2.x, v2.y, v2.z);
    }
    endShape(CLOSE)
    counter+=0.15
  }     
  
  scale(10);
       translate(-50,50);
  
        let waveform = fft.waveform(); // analyze the waveform
  beginShape();
  strokeWeight(1);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();
  
 
  
      let waveform3 = fft.waveform(); // analyze the waveform
  beginShape();
  strokeWeight(1);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 50, waveform.length, 0, width);
    let y = map(waveform[i], 1, -1, height, 0);
    vertex(x, y);
  }
  endShape();
      
   scale(5);
       translate(100,-100);
  
        let waveform4 = fft.waveform(); // analyze the waveform
  beginShape();
  strokeWeight(1);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();
  
 
  
      let waveform5 = fft.waveform(); // analyze the waveform
  beginShape();
  strokeWeight(1);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 50, waveform.length, 0, width);
    let y = map(waveform[i], 1, -1, height, 0);
    vertex(x, y);
  }
  endShape();
      //this is just an angle to make the sphere rotate in our view
angle+=0.19


}

function snowflake() {
  // initialize coordinates
  this.posX = 0;
  this.posY = random(-50, 0);
  this.initialangle = random(0, 2 * PI);
  this.size = random(.5, 2);

  // radius of snowflake spiral
  // chosen so the snowflakes are uniformly spread out in area
  this.radius = sqrt(random(pow(width / 2, 2)));

  this.update = function(time) {
    // x position follows a circle
    let w = 0.6; // angular speed
    let angle2 = w * time + this.initialangle;
    // let angle2 = 10;
    this.posX = width / 2 + this.radius * sin(angle2);
    

    // different size snowflakes fall at slightly different y speeds
    this.posY += pow(this.size, 0.5);

    // delete snowflake if past end of screen
    if (this.posY > height) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 1);
    }

  };

  this.display = function() {
    ellipse(this.posX, this.posY, this.size);
  };
}
