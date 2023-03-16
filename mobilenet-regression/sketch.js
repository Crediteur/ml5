let mobilenet;
let classifier;
let video;
let label = "loading model";
let div;
let button0;
let button1;
let button0Press = 0;
let button1Press = 0;
let bp0;
let bp1;
let trainButton;

function modelReady() {
  console.log("Model is ready!!!");
  // classifier.load('model.json', customModelReady);
}

// function customModelReady() {
//   console.log('Custom Model is ready!!!');
//   label = 'model ready';
//   classifier.classify(getResults);
// }

function videoReady() {
  console.log("Video is ready!!!");
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  mobilenet = ml5.featureExtractor("MobileNet", modelReady);
  classifier = mobilenet.classification(video, videoReady);
  div = createDiv().id("buttons");

  //button0
  button0 = createButton("accept").parent("buttons");
  //label
  bp0 = createP(button0Press).parent("buttons");
  button0.mousePressed(function () {
    button0Press++;
    bp0.html(button0Press);
    classifier.addImage("accept");
  });

  //button0
  button1 = createButton("reject").parent("buttons");
  //label
  bp1 = createP(button1Press).parent("buttons");
  button1.mousePressed(function () {
    button1Press++;
    bp1.html(button1Press);
    classifier.addImage("reject");
  });

  trainButton = createButton("train").parent("buttons");
  trainButton.mousePressed(function () {
    classifier.train(whileTraining);
    button0Press = 0;
    button1Press = 0;
    bp0.html(button0Press);
    bp1.html(button1Press);
  });

  saveButton = createButton("save").parent("buttons");
  saveButton.mousePressed(function () {
    classifier.save();
  });
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);
  fill(255);
  textSize(16);
  text(label, 10, height - 10);
}

//loss is error margin of new data
function whileTraining(loss) {
  if (loss == null) {
    console.log("Training Complete");
    classifier.classify(getResults);
  } else {
    console.log(loss);
  }
}

function getResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    label = "";
    for (res of result) {
      label += res.label + " " + Math.round(res.confidence * 1000) / 10 + " ";
    }
    classifier.classify(getResults);
  }
}
