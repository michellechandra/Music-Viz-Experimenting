// p5sound variables
var soundFile;

var centerX;
var centerY;

var stars = []; // array to hold array of star objects

//var degree = 0; // how far around the circle

var duration = 0;
var currentTime = 0;
var increment = 0; // map(currentTime, 0, duration, 0, 360)

var fft;

var amplitude;
var volume;

var numBands = 512;  // 1024, 512,

// array of all the frequency values
var freqValues = [];

function setup () {
  // p5 sound
  soundFile = new SoundFile('Chris_Zabriskie_-_06_-_Divider.mp3');
  var thisCanvas = createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  noStroke();

  centerX = width/2; // center of the circle
  centerY = height/2; // center of the circle

  // create a bunch of star objects and add them to the array called stars
  // length of stars array will be linked to buffer size
  for (i =0; i<=numBands/2; i++) {
    stars.push(new Star(i));
  }

  // sound
  soundFile.play();
  fft = new FFT(.01, numBands);  // fft - how to determine low and high values
  amplitude = new Amplitude(.985); // amplitude takes 'smoothing'
  
}

function draw() { 

  volume = amplitude.getLevel();  

  updateIncrement();

  freqValues = fft.processFreq();
  
  // for every Star object in the array called 'stars'...
  for (i =0; i<stars.length; i++) {
   
    
    if (volume > .05) {
      stars[i].color[3] = (i % 80)*volume;
      stars[i].diameter = map(freqValues[i], 120, 256, 0, 70.0)*volume;
     // stars[i].degree = map(freqValues[i], 120, 256, 0, -180)*volume; // 0, -180 (0, value) (-value, value)(-width/1.2, width/1.2);
     // stars[i].degree = map(freqValues[i], 120, 256, -360, 360)*volume; 
     //stars[i].degree = map(freqValues[i], 120, 256, 0, -180)*volume; 
    stars[i].degree = map(freqValues[i], 120, 512, 0, -180)*volume; 
    // stars[i].degree = map(noise(this.x, this.y), 0, 1, -180, 180);
      stars[i].increment = map(freqValues[i], 120, 256, 0, -180)*volume; // freq values  i < 512 (highest frequency range)

    } else {
      stars[i].color[3] = (i % 50)*volume;
      stars[i].diameter = map(freqValues[i], 120, 256, 0, 40.0)*volume;
     // stars[i].degree = map(freqValues[i], 120, 256, -90, 360)*volume; 
   //   stars[i].degree = map(freqValues[i], 120, 256, -360, 360)*volume; 
     stars[i].degree = map(freqValues[i], 120, 512, -360, -180)*volume;  //(-360, 360)
     stars[i].increment = map(freqValues[i], 120, 256, -180, -360)*volume;
     //  stars[i].degree = map(freqValues[i], 120, 256, -180, 0)*volume; // -90, 180, 

     //  stars[i].degree = map(freqValues[i], 120, 256, 180, 360)*volume;
    }
    // stars[i].color[3] = freqValues[i]/5; // map brightness to frequency value
    // move and draw the star
    stars[i].update();
  }

 // Drawing over the sketch, creates some interesting dimension 

 /*var bRed = map(currentTime, 0, duration, 10, 0);
  var bBlue = map(currentTime, 0, duration, 10, 40);
  if (frameCount % 80 == 0 ){
    if (duration > 0) {
      background(bRed,0,bBlue,10);
    } else if (frameCount % 40 == 0) {
      background(0,0,0,2);
    }
  }   */

/* if (frameCount % 20 == 0 ){
      background(0,0,0,1);
    } */
}

// The star object
function Star(i) {
  var totalStarCount = numBands/2;
  if (i < totalStarCount/5 ){ // high range (high pitch) in theory
      // this.color = [252, 238, 223, 200]; // light yellow
    //this.color = [255, 255,255,1];
    this.color = [15, 151, 163, 1];
     this.diameter = (.75);   // 2
  }
  else if (i < totalStarCount/2){  // med range in theory?
    //this.color = [235, 215, 224, 200]; // light red
     this.color = [200, 200,200,1];
     this.diameter = (.5);   // 1
  }
  else {   // low range (low pitch in theory)
    //this.color = [191, 214, 236, 200]; // light blue
    this.color = [180, 180,180,1];
    this.diameter = (.25);  // .5
  }
 // this.diameter = random(200,300); // diameter of each star ellipse
  this.diameter;
  this.degree;
  this.degree = random(-360, 360);
  this.radius = random(-width/1.2, width/1.2);
 // this.x = centerX + (this.radius * noise(cos(radians(this.degree))));
 // this.y = centerY + (this.radius * noise(sin(radians(this.degree))));
  this.x = centerX + (this.radius * cos(radians(this.degree)));
  this.y = centerY + (this.radius * sin(radians(this.degree)));
}

// called by draw loop
Star.prototype.update = function() {

   this.x = centerX + (this.radius * cos(radians(this.degree + increment)));
  this.y = centerY + (this.radius * sin(radians(this.degree + increment)));
    // update the x and y position based on the increment

 //   var freq = 20;
 //   var amp = 20;

//    this.x = centerX + (this.radius + sin((radians(this.degree) + increment) * freq) * amp) * sin(radians(this.degree) + increment);
 //   this.y = centerY + (this.radius + cos((radians(this.degree) + increment) * freq) * amp) * cos(radians(this.degree) + increment);

//  var radiusNoise = random(10);
//  var newRadius = this.degree+ ((noise(radiusNoise))*200) - 100;

//  this.x = centerX + (this.radius * noise(cos(radians(newRadius) + increment)));
//  this.y = centerY + (this.radius * noise(sin(radians(newRadius) + increment)));
  
// this.x = centerX + (this.radius * noise(cos(radians(this.degree + increment))));
//  this.y = centerY + (this.radius * noise(sin(radians(this.degree + increment))));


  // There is such a thing as too much recursion
 // this.x = centerX + (this.radius * cos(tan(tan(cos(radians(this.degree + increment))))));
 // this.y = centerY + (this.radius * sin(tan(tan(sin(radians(this.degree + increment))))));

 // this.x = centerX + (this.radius * tan(tan(cos(radians(this.degree + increment)))));
 // this.y = centerY + (this.radius * tan(tan(sin(radians(this.degree + increment)))));

//  this.x = centerX + (this.radius *  noise(cos(radians(this.degree + increment))));
//  this.y = centerY + (this.radius * noise(sin(radians(this.degree + increment))));

  // Affecting the increment with tan function, perhaps too erratic
 // this.x = centerX + (this.radius *  tan(cos(radians(this.degree + tan(tan(increment))))));
 // this.y = centerY + (this.radius * tan(sin(radians(this.degree + tan(tan(increment))))));

// More experimental tan increment variation
// this.x = centerX + (this.radius *  cos(radians(this.degree + tan(increment))));
// this.y = centerY + (this.radius * sin(radians(this.degree + sin(increment))));
    noStroke;
    // draw an ellipse at the new x and y position
    fill(this.color);
   // stroke(this.color
   ellipse(this.x, this.y, this.diameter, this.diameter);

}


// update rotation based on song time / duration
function updateIncrement() {
  currentTime = soundFile.currentTime();
  //console.log(currentTime);

  duration = soundFile.duration();
  var myIncrement = map(currentTime, 0, duration, 0, 180);
  if (isNaN(myIncrement)) {
    console.log('not ready');
  }
  else {
    increment = myIncrement;
  }

  var fadeOutOne = 30;
  var fadeOutTwo = 120;

  // when document is loaded and ready, execute my jQuery manipulations!

   $(document).ready(function() {
  //console.log('jquery is working');
  
  // Fade out gradients every 60 seconds
 // $('.gradientOne').animate({ opacity:0 }, 30000 );

  if (currentTime > fadeOutOne ) {
  $('.gradientTwo').animate({ opacity: 0 }, 30000); 
    }

  if (currentTime > fadeOutTwo ){
  $('.gradientThree').animate({ opacity: 0}, 60000); }
 });

     // Checking element is selected
 /* if ( $( '.gradientOne' ).length) {
    console.log('jquery' ); 
  } */
}
