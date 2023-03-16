let video;
let detector;
let detections = [];

function preload() {
  detector = ml5.objectDetector("cocossd");
}
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  detector.detect(video, getDetections);
}
function draw() {
  image(video, 0, 0);

  for (let i = 0; i < detections.length; i++) {
    let object = detections[i];
    stroke(0, 255, 0);
    strokeWeight(4);
    noFill();
    rect(object.x, object.y, object.width, object.height);
    noStroke();
    fill(255);
    textSize(16);
    text(
      object.label + " " + Math.round(object.confidence * 1000) / 10 + "%",
      object.x + 5,
      object.y - 10
    );
  }
}

//the data of the query get passed here as results through a callback
function getDetections(error, results) {
  if (error) {
    console.log(error);
  }
  detections = results;
  detector.detect(video, getDetections);
}
