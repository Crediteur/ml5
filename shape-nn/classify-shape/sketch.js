let shapeClassifier;
let canvas;
let resultsDiv;
let img;
let drawing = true;
let video;
let videoLoaded = false;
let lastFrame;

function setup() {
  canvas = createCanvas(640, 480);
  background(255);

  //set up nn
  const options = {
    inputs: [64, 64, 4],
    task: "imageClassification", //or regression
  };
  shapeClassifier = ml5.neuralNetwork(options);

  //load trained model data
  const modelDetails = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/model.weights.bin",
  };
  shapeClassifier.load(modelDetails, modelLoaded);

  //update div text
  resultsDiv = createDiv("loading model");
  img = createImage(64, 64);
  strokeWeight(20);
  noFill();

  //radio menu
  radio = createRadio();
  radio.option("true", "draw");
  radio.option("false", "webcam");
  radio.selected("true");
}

function draw() {
  drawing = radio.value() === "true";
  //check last frame to clear canvas
  if (drawing !== lastFrame) {
    background(255);
    if (video) {
      video.remove();
      videoLoaded = false;
    }
  }

  //if video has not been loaded this session, load it
  if (!videoLoaded && !drawing) {
    loadVideo();
  }

  //draw or display video on canvas
  if (drawing) {
    if (mouseIsPressed) {
      strokeWeight(8);
      line(mouseX, mouseY, pmouseX, pmouseY);
    }
  } else {
    image(video, 0, 0, width, height);
  }

  //track last frame
  lastFrame = drawing;
}

function keyPressed() {
  if (drawing) {
    if (keyCode === 32) {
      background(255);
    }
  }
}

//callback for loading the pre-trained model
function modelLoaded() {
  resultsDiv.html("model loaded");
  console.log("pre-trained model loaded");
  classifyImage();
}

//classify image
function classifyImage() {
  if (drawing) {
    img.copy(canvas, 0, 0, width, height, 0, 0, 64, 64);
    shapeClassifier.classify({ image: img }, gotResults);
  } else {
    img.copy(video, 0, 0, width, height, 0, 0, 64, 64);
    shapeClassifier.classify({ image: img }, gotResults);
  }
}

//get results
function gotResults(err, results) {
  if (err) {
    console.error(err);
    return;
  }
  let labels = results[0].label;
  let confidence = floor(10000 * results[0].confidence) / 100;

  resultsDiv.html(`${labels} ${confidence}%`);
  classifyImage();
}

//load webcam video for first time
function loadVideo() {
  videoLoaded = true;
  console.log("video loaded");
  video = createCapture(VIDEO);
  video.hide();
  //video.size(64, 64);
}
