let video;
let features;
let knn;
let labelP;
let ready = false;
let x;
let y;
let label = "nothing";
let loadModel = true;

async function setup() {
  createCanvas(320, 240);
  video = await createCapture(VIDEO, () => {
    video.size(width, height);
  });
  features = await ml5.featureExtractor("MobileNet", modelReady);
  knn = ml5.KNNClassifier();
  labelP = createP("need training data");
  labelP.style("font-size", "32px");
  x = width / 2;
  y = height / 2;
}

function modelReady() {
  console.log("model ready!");
  // load saved model
  if (loadModel) {
    knn.load("model.json", function () {
      console.log("knn loaded");
    });
  }
}

function goClassify() {
  const logits = features.infer(video);
  knn.classify(logits, function (error, result) {
    if (error) {
      console.error(error);
    } else {
      label = result.label;
      labelP.html(result.label);
    }
  });
}

function keyPressed() {
  const logits = features.infer(video);
  if (key == "l") {
    knn.addExample(logits, "left");
    console.log("left");
  } else if (key == "r") {
    knn.addExample(logits, "right");
    console.log("right");
  } else if (key == "u") {
    knn.addExample(logits, "up");
    console.log("up");
  } else if (key == "d") {
    knn.addExample(logits, "down");
    console.log("down");
  } else if (key == "s") {
    knn.save("model.json");
  }
}

function draw() {
  background(0);
  fill(255);
  ellipse(x, y, 24);

  if (label == "left") {
    x--;
  } else if (label == "right") {
    x++;
  } else if (label == "up") {
    y--;
  } else if (label == "down") {
    y++;
  }

  //image(video, 0, 0);
  if (knn.getNumLabels() > 0) {
    goClassify();
    ready = true;
  }
}
