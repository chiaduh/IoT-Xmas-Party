video = document.getElementById('video')
startbutton = document.getElementById('startbutton');


width = 400
height = 300
startVideo();
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  })
  .then(function(stream) {
    video.srcObject = stream;
    video.play();
  })
  .catch(function(err) {
    console.log("An error occurred: " + err);
  });
}

//Chia: Face Detection
video.addEventListener('playing', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const arr = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
    const resizedDetections = await faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 3000)

})


video.addEventListener('playing', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const ARR = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
    for (var i = 0; i < ARR.length; i++){ //ARR[N] means Nth person's face ID
      var happyrate = ARR[i].expressions.happy
      if (happyrate > 0.9) {
          takepicture();
          ev.preventDefault();
          break;
        }}
  }, 3000)
})


//Chia: Download Canvas as .PNG
var download = function(){
  var link = document.createElement('a');
  link.download = 'Test.png';
  link.href = document.getElementById('imageOfCombine').src
  link.target = '_blank'
  document.body.appendChild(link)
  link.click();
  document.body.removeChild(link)
}

  //Chia: Take Picture
  function takepicture() {
    var videoNow = document.getElementById('video')
    var layer2 = document.getElementsByTagName('canvas')[0]
    var photoCanvas = document.createElement('canvas')
    photoCanvas.setAttribute('id', 'photoCanvas')
    photoCanvas.setAttribute('style', 'display: none')
    photoCanvas.width = videoNow.width
    photoCanvas.height = videoNow.height
    photoCanvas.getContext('2d').drawImage(videoNow, 0, 0, photoCanvas.width, photoCanvas.height)
    window.document.body.appendChild(photoCanvas)
    if (width && height) {
      var can1 = photoCanvas.getContext('2d');
      can1.drawImage(layer2, 0, 0);
      var image = can1.canvas.toDataURL('image/png');
      var img = document.createElement('img');
      img.setAttribute('src', image)
      img.setAttribute('id', 'imageOfCombine')
      window.document.body.appendChild(img)
      download();
    } else {
      clearphoto();
    }
}

//Chia: Clean Canvas after Taking Photo
function clearphoto() {
  var context = canvasByDet.getContext('2d');
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvasByDet.width, canvasByDet.height);

  var data = canvasByDet.toDataURL('image/png');
  photo.setAttribute('src', data);
}

//Chia: Take picture & Clean Canvas if Click Button
startbutton.addEventListener('click', function(ev) {
  takepicture();
  ev.preventDefault();
}, false);
