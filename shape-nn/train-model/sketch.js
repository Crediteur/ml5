let circles = [];
let squares = [];
let triangles = [];
let shapeClassifier;
let sample;

//sketch that loads images into a ml5 image classification neural network
//produces model.json files on key press 't'
function preload() {
  for (let i = 0; i < 100; i++) {
    let index = nf(i + 1, 4, 0);
    circles[i] = loadImage(`data/circle${index}.png`);
    squares[i] = loadImage(`data/square${index}.png`);
    triangles[i] = loadImage(`data/triangle${index}.png`);
  }
}

function setup() {
  createCanvas(400, 400);
  background(240);

  let options = {
    inputs: [64, 64, 4], //dimensions of image, colour channels
    task: "imageClassification",
    debug: true,
  };
  shapeClassifier = ml5.neuralNetwork(options); //declare nn obj with options

  //add data to nn, with label
  for (let i = 0; i < circles.length; i++) {
    shapeClassifier.addData({ image: circles[i] }, { label: "circle" });
    shapeClassifier.addData({ image: squares[i] }, { label: "square" });
    shapeClassifier.addData({ image: triangles[i] }, { label: "triangle" });
  }

  //normalize data
  shapeClassifier.normalizeData();

  //bonus: display all shape data
  sample = createGraphics(width, height);

  //grid of 2x2 for each shape
  let reducedW = width / 20;
  let reducedH = height / 20;
  let dataW = circles[0].width;
  let dataH = circles[0].height;

  //circle
  for (let i = 0; i < circles.length; i++) {
    //calculate x and y pos
    let x = (i * reducedW) % (width / 2);
    let y = floor(i / 10) * reducedH;
    sample.copy(circles[i], 0, 0, dataW, dataH, x, y, reducedW, reducedH);
  }

  //square
  for (let i = 0; i < squares.length; i++) {
    //calculate width/2+x and y pos
    let x = width / 2 + ((i * reducedW) % (width / 2));
    let y = floor(i / 10) * reducedH;
    sample.copy(squares[i], 0, 0, dataW, dataH, x, y, reducedW, reducedH);
  }

  //triangle
  for (let i = 0; i < triangles.length; i++) {
    //calculate x and height/2+y pos
    let x = (i * reducedW) % (width / 2);
    let y = height / 2 + floor(i / 10) * reducedH;
    sample.copy(triangles[i], 0, 0, dataW, dataH, x, y, reducedW, reducedH);
  }
}

function draw() {
  image(sample, 0, 0);
  text("press 't' to train model", width / 2 + 20, height / 2 + 30);
}

function keyPressed() {
  if (keyCode === 84) {
    console.log("training...");
    //train data with 50 epochs (repeats)
    shapeClassifier.train({ epochs: 50 }, finishedTraining);
  }
}

function finishedTraining() {
  console.log("training finished");
  shapeClassifier.save();
}
