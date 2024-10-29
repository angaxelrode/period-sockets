let socket;
let userName;
let users = {};

function setup() {
  // Create canvas with specific dimensions and bring it to the top for debugging
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style('z-index', '10'); // Force canvas to top layer temporarily
  background(255, 0); // Transparent background to see underlying elements

  // Prompt for user's name
  userName = prompt("What phase of the menstrual cycle are you on? If you are not sure, type IDK, find out on this page & then hit refresh.", "NAME is in their follicular phase, or NAME doesn't get their period!");
  if (!userName) userName = "Anonymous";

  // Open socket connection
  socket = io();

  // Listen for connection confirmation and send user data
  socket.on('connect', function() {
    console.log("Connected");
    socket.emit('userData', { name: userName, x: mouseX, y: mouseY });
  });

  // Listen for incoming user data from the server
  socket.on('userData', function(data) {
    users[data.id] = data;
  });

  // Listen for user disconnection events
  socket.on('userDisconnected', function(userId) {
    delete users[userId];
  });
}

function draw() {
  // Set a solid background color to fully clear the canvas each frame
  background(255,0); // This will clear the canvas with a white background, removing any trails

  // Draw all users on canvas
  for (let id in users) {
    let user = users[id];
    fill('#FF0000');
    ellipse(user.x, user.y, 10, 10);
    textAlign(CENTER, BOTTOM);
    text(user.name, user.x, user.y - 10);
  }
}

function mouseMoved() {
  // Send updated position to server
  if (socket) {
    socket.emit('userData', { name: userName, x: mouseX, y: mouseY });
  }
}