let video;
let poseNet;
let people = [];
const personConfidence = 0;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
}

function draw() {
  //draw video
  image(video, 0, 0);

  if (people.length > 0) {
    //draw each detected person
    for (const person of people) {
      //fill colour based on confidence score
      const pose = person.pose;
      const d =
        dist(pose.leftEye.x, pose.leftEye.y, pose.rightEye.x, pose.rightEye.y) /
        3;

      //DEBUG
      // console.log(people.length + " people detected");
      console.log(person);
      // console.log(d);

      //draw ellipses and lines
      push();
      {
        strokeWeight(2);
        stroke(255);
        if (pose.score < 30) fill(200, 10, 10);
        else if (pose.score < 60) fill(20, 200, 0);
        else if (pose.score < 90) fill(0, 20, 200);
        else fill(120, 0, 120);

        //draw body circles
        for (let i = 0; i < pose.keypoints.length; i++) {
          let x = pose.keypoints[i].position.x;
          let y = pose.keypoints[i].position.y;
          ellipse(x, y, d);
        }

        //draw joining lines from skeleton
        for (let i = 0; i < person.skeleton.length; i++) {
          let p1 = person.skeleton[i][0];
          let p2 = person.skeleton[i][1];
          line(p1.position.x, p1.position.y, p2.position.x, p2.position.y);
        }

        //draw lines connecting face?

        //draw bounding box outlining person with confidence score
        //find min and max x and y?
      }
      pop();
    }
  }
}

//callback when poseNet detects a specified pose
//people is an array containing person
function gotPoses(peopleData) {
  if (peopleData.length > 0) {
    people = peopleData;

    //if there are more than one person detected by poseNet
    if (peopleData.length > 1) {
      people = [];
      for (const person of peopleData) {
        //filter people by confidence score
        if (person.pose.score > personConfidence) people.push(person);
      }
    }
  }
}

// callback when poseNet is loaded
function modelLoaded() {
  console.log("poseNet ready");
}
