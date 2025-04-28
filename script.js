const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// Function to handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const imageData = e.target.result;
        // You can use imageData to display the image or fetch details about the movie
        console.log(imageData); // Example: Log the image data to the console
    }

    reader.readAsDataURL(file);
}

// Get initial movies
getMovies(API_URL);

async function getMovies(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(`${data.status_message} (${res.status})`);
        }

        showMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error.message);
    }
}

function showMovies(movies) {
    main.innerHTML = '';

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview } = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
        `;
        main.appendChild(movieEl);
    });
}

function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value.trim();

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);

        search.value = '';
    } else {
        window.location.reload();
    }
});

// Chatbot with Microphone
const chatPopup = document.getElementById('chat-popup');
const chatContent = document.getElementById('chat-content');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');

// Show chat popup
function openChat() {
    chatPopup.style.display = 'block';
}

// Hide chat popup
function closeChat() {
    chatPopup.style.display = 'none';
}

// Add message to chat content
function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender);
    messageElement.innerText = message;
    chatContent.appendChild(messageElement);
}

// Event listener for send button
sendBtn.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message !== '') {
        addMessage(message, 'user');
        // Here you can implement your chatbot logic
        // For simplicity, I'm just echoing back the user message
        addMessage('Chatbot: ' + message, 'bot');
        userInput.value = '';
        chatContent.scrollTop = chatContent.scrollHeight;
    }
});

// Event listener for microphone button
micBtn.addEventListener('click', () => {
    startVoiceRecognition();
});

function startVoiceRecognition() {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        // Optionally, you can trigger the chatbot response here
    };

    recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
    };
}

// Event listener for opening and closing chat popup
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search').addEventListener('focus', closeChat);
    document.getElementById('search').addEventListener('blur', openChat);
});