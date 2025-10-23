const createButton = document.getElementById('create');
const gameCodeDisplay = document.getElementById('gameCode');
const copyConnectionCodeButton = document.getElementById('copyConnectionCode');
const username = document.querySelector('.userInput');

const ws = new WebSocket('ws://localhost:8080');
let localConnection;
let dataChannel;
let gameCode = '';

// Logare la deschiderea conexiunii WebSocket
ws.onopen = () => {
    console.log('Connected to signaling server');
    alert('Connected to server');
};

// Logare pentru mesajele primite prin WebSocket
ws.onmessage = async (event) => {
    console.log('Message from server:', event.data);
    const message = JSON.parse(event.data);

    if (message.type === 'offer') {
        await localConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
        const answer = await localConnection.createAnswer();
        await localConnection.setLocalDescription(answer);
        ws.send(JSON.stringify({ type: 'answer', answer: localConnection.localDescription }));
    } else if (message.type === 'answer') {
        await localConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
    } else if (message.type === 'candidate') {
        await localConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
    }
};

// Inițializarea conexiunii WebRTC
function initializePeerConnection() {
    localConnection = new RTCPeerConnection();

    dataChannel = localConnection.createDataChannel('scribble');
    dataChannel.onopen = () => console.log('Data channel open');
    dataChannel.onmessage = (event) => {
        console.log('Received message:', event.data);
    };

    localConnection.onicecandidate = (event) => {
        if (event.candidate) {
            ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
        }
    };

    localConnection.ondatachannel = (event) => {
        dataChannel = event.channel;
        dataChannel.onmessage = (event) => {
            console.log('Received message:', event.data);
        };
    };

    const createOffer = async () => {
        const offer = await localConnection.createOffer();
        await localConnection.setLocalDescription(offer);
        ws.send(JSON.stringify({ type: 'offer', offer: localConnection.localDescription }));
    };

    // Asigură-te că apelăm createOffer atunci când conexiunea WebSocket este deschisă
    if (ws.readyState === WebSocket.OPEN) {
        createOffer();
    } else {
        ws.onopen = createOffer;
    }
}

// Generarea și afișarea codului de joc
createButton.addEventListener('click', () => {
    console.log('Create button clicked');  // Adăugat pentru debugging
    gameCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    localStorage.setItem('gameCode', gameCode); // Stochează codul de joc în localStorage
    if(username == null) console.error('No username selected', err);
    window.location.href = 'app.html'; // Redirecționează către pagina cu tabla de joc
});

// Copierea codului de joc în clipboard folosind API-ul Clipboard
copyConnectionCodeButton.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(connectionCodeInput.value);
        alert('Game code copied to clipboard');
     } catch (err) {
        console.error('Failed to copy text: ', err);
    }
});
