const socket = io();
const joinBtn = document.getElementById("join-btn");
const roomInput = document.getElementById("room-input");
const errorDiv = document.getElementById("error");

const joinContainer = document.getElementById("join-container");
const videoChat = document.getElementById("video-chat");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

let localStream;
let peerConnection;
let roomName;

// Config for peer connection (STUN server)
const config = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
};

joinBtn.onclick = async () => {
  const name = roomInput.value.trim();

  if (!name) {
    errorDiv.innerText = "Please enter a valid room name.";
    return;
  }

  roomName = name;

  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
    joinRoom();
  } catch (err) {
    errorDiv.innerText = "Camera and microphone access are required.";
    console.error(err);
  }
};

function joinRoom() {
    socket.emit("join-room", roomName);
  
    socket.on("room-full", () => {
      errorDiv.innerText = "Room is full. Try another room.";
    });
  
    socket.on("joined", () => {
      joinContainer.style.display = "none";
      videoChat.style.display = "block";
    });
  
    socket.on("ready", () => {
      startWebRTC(true); // initiator
    });
  
    socket.on("signal", async (data) => {
      if (!peerConnection) startWebRTC(false); // receiver
  
      if (data.type === "offer") {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("signal", answer);
      } else if (data.type === "answer") {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
      } else if (data.candidate) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error("Error adding ICE candidate", err);
        }
      }
    });
  }
  function startWebRTC(isInitiator) {
    peerConnection = new RTCPeerConnection(config);
  
    // Add local stream to peer
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
  
    // Display remote stream
    peerConnection.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
    };
  
    // ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", { candidate: event.candidate });
      }
    };
  
    if (isInitiator) {
      peerConnection.onnegotiationneeded = async () => {
        try {
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          socket.emit("signal", offer);
        } catch (err) {
          console.error("Error during negotiation", err);
        }
      };
    }
  }
    