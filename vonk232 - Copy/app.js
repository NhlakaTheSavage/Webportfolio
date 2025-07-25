// DOM Elements
const profileIcon = document.querySelector('.profile-icon');
const profileModal = document.getElementById('profile-modal');
const closeModal = document.querySelector('.close-modal');
const playBtn = document.querySelector('.play-btn');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const volumeSlider = document.querySelector('.volume-slider');
const volumeLevel = document.querySelector('.volume-level');
const mediaItems = document.querySelectorAll('.media-item');
const videoItems = document.querySelectorAll('.video-item');
const navLinks = document.querySelectorAll('.nav-links a');

// Local Music Elements
const addLocalMusicBtn = document.getElementById('add-local-music');
const localMusicInput = document.getElementById('local-music-input');
const localMusicStatus = document.getElementById('local-music-status');
const localMusicList = document.getElementById('local-music-list');

// Audio Player
let audioPlayer = new Audio();
let currentTrack = null;
let localMusicLibrary = [];
let albums = [];

// Initialize DOM elements when the page loads
function initializeElements() {
    // Set up event listeners for local music
    if (addLocalMusicBtn && localMusicInput) {
        addLocalMusicBtn.addEventListener('click', () => {
            localMusicInput.click();
        });
        
        localMusicInput.addEventListener('change', handleFileSelect);
    }
    
    // Set up progress bar click event
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            if (currentTrack && currentTrack.fileUrl) { // Only work for actual audio files
                const width = progressBar.clientWidth;
                const clickX = e.offsetX;
                const duration = audioPlayer.duration;
                audioPlayer.currentTime = (clickX / width) * duration;
            }
        });
    }
    
    // Set up volume slider
    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            audioPlayer.volume = volumeSlider.value / 100;
        });
        
        // Set initial volume
        volumeSlider.value = 70;
        audioPlayer.volume = 0.7;
    }
    
    // Set up play button
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (currentTrack) {
                if (audioPlayer.paused) {
                    audioPlayer.play();
                    const playIcon = playBtn.querySelector('i');
                    playIcon.classList.remove('fa-play');
                    playIcon.classList.add('fa-pause');
                } else {
                    audioPlayer.pause();
                    const playIcon = playBtn.querySelector('i');
                    playIcon.classList.remove('fa-pause');
                    playIcon.classList.add('fa-play');
                }
            }
        });
    }
}

// Function to handle file selection
function handleFileSelect(event) {
    const files = event.target.files;
    
    if (files.length === 0) {
        return;
    }
    
    // Update status
    localMusicStatus.textContent = `Processing ${files.length} file(s)...`;
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check if it's an audio file
        if (!file.type.startsWith('audio/')) {
            console.warn(`Skipping non-audio file: ${file.name}`);
            continue;
        }
        
        // Create object URL for the file
        const fileUrl = URL.createObjectURL(file);
        
        // Create a temporary audio element to get duration
        const tempAudio = new Audio(fileUrl);
        
        tempAudio.addEventListener('loadedmetadata', () => {
            // Create a track object
            const trackId = 'local-' + Date.now() + '-' + i;
            const track = {
                id: trackId,
                name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
                artist: 'Local File',
                duration: tempAudio.duration,
                fileUrl: fileUrl,
                album: 'Uploaded Tracks'
            };
            
            // Add to library
            localMusicLibrary.push(track);
            
            // Add to UI
            addLocalMusicToUI(track);
            
            // Update status
            localMusicStatus.textContent = `${localMusicLibrary.length} tracks from your music library`;
            
            // Add to Uploaded Tracks album if it doesn't exist
            let uploadedAlbum = albums.find(album => album.name === 'Uploaded Tracks');
            if (!uploadedAlbum) {
                uploadedAlbum = {
                    name: 'Uploaded Tracks',
                    artist: 'Various Artists',
                    tracks: []
                };
                albums.push(uploadedAlbum);
                addAlbumToUI(uploadedAlbum);
            }
            
            // Add track to album
            uploadedAlbum.tracks.push(track);
            updateAlbumUI(uploadedAlbum);
        });
        
        tempAudio.addEventListener('error', () => {
            console.error(`Error loading audio file: ${file.name}`);
        });
    }
    
    // Reset file input
    event.target.value = '';
}

// Add event listeners for audio player after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Make sure audioPlayer is initialized
    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', () => {
            const currentTime = audioPlayer.currentTime;
            const duration = audioPlayer.duration;
            const progressPercent = (currentTime / duration) * 100;
            
            // Make sure progress element exists
            if (progress) {
                progress.style.width = `${progressPercent}%`;
            }
            
            // Update time display if elements exist
            const minutes = Math.floor(currentTime / 60);
            const seconds = Math.floor(currentTime % 60);
            const timeElement = document.querySelector('.current-time');
            if (timeElement) {
                timeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        });
        
        audioPlayer.addEventListener('ended', () => {
            // Reset play button if it exists
            if (playBtn) {
                const playIcon = playBtn.querySelector('i');
                if (playIcon) {
                    playIcon.classList.remove('fa-pause');
                    playIcon.classList.add('fa-play');
                }
            }
            
            // Reset progress if it exists
            if (progress) {
                progress.style.width = '0%';
            }
            
            // Play next track in the album if available
            playNextTrack();
        });
    }
});

// Function to play next track in the album
function playNextTrack() {
    if (!currentTrack) return;
    
    // Find the current album
    const album = albums.find(album => album.tracks.some(track => track.id === currentTrack.id));
    if (!album) return;
    
    // Find the index of the current track in the album
    const currentIndex = album.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    // Get the next track in the album
    const nextIndex = (currentIndex + 1) % album.tracks.length;
    const nextTrack = album.tracks[nextIndex];
    
    // Play the next track
    playLocalTrack(nextTrack);
}

// Function to play local track
function playLocalTrack(track) {
    // Stop current track if playing
    if (audioPlayer.src) {
        audioPlayer.pause();
    }
    
    // Update current track
    currentTrack = track;
    
    // Check if track has a file URL
    if (track.fileUrl) {
        // Set source and play actual file
        audioPlayer.src = track.fileUrl;
        audioPlayer.play()
            .catch(error => {
                console.error('Error playing audio:', error);
                // If there's an error playing the file, show an alert
                alert(`Error playing ${track.name}: ${error.message}. Please check if the file exists.`);
            });
        
        // Update total time display if element exists
        const totalMinutes = Math.floor(track.duration / 60);
        const totalSeconds = Math.floor(track.duration % 60);
        const totalTimeElement = document.querySelector('.total-time');
        if (totalTimeElement) {
            totalTimeElement.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        }
    } else {
        // This should not happen anymore since all tracks should have file URLs
        console.error(`No file URL for track: ${track.name}`);
        alert(`Cannot play ${track.name}: No audio file associated with this track.`);
        return;
    }
    
    // Update player UI
    document.querySelector('.track-info h4').textContent = track.name;
    document.querySelector('.track-info p').textContent = track.artist;
    
    // Change play button to pause
    const playIcon = playBtn.querySelector('i');
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
    
    // Highlight playing track
    const allItems = document.querySelectorAll('.local-music-item');
    allItems.forEach(item => {
        item.classList.remove('playing');
        const playBtn = item.querySelector('.play-local-track i');
        if (playBtn) {
            playBtn.classList.remove('fa-pause');
            playBtn.classList.add('fa-play');
        }
    });
    
    const playingItem = document.querySelector(`.local-music-item[data-track-id="${track.id}"]`);
    if (playingItem) {
        playingItem.classList.add('playing');
        const playBtn = playingItem.querySelector('.play-local-track i');
        if (playBtn) {
            playBtn.classList.remove('fa-play');
            playBtn.classList.add('fa-pause');
        }
    }
}

// Predefined music tracks from local music folder
const predefinedTracks = [
  { name: "Ngathi Nguye (feat. Umashotana)", artist: "Mafikizolo", duration: 240, album: "Mafikizolo Hits" },
  { name: "Wethu", artist: "Mafikizolo", duration: 235, album: "Mafikizolo Hits" },
  { name: "Igoli", artist: "Mafikizolo", duration: 228, album: "Mafikizolo Hits" },
  { name: "Ngiyazifela Ngawe", artist: "Ntencane ft The Legacy", duration: 312, album: "Ntencane Collection" },
  { name: "Uthando Lwami", artist: "Ntencane", duration: 295, album: "Ntencane Collection" },
  { name: "Love Language", artist: "Ntencane ft Naledi Aphiwe", duration: 305, album: "Ntencane Collection" },
  { name: "Umlando", artist: "Ugasheni Ugqeqe", duration: 267, album: "Ugasheni Ugqeqe Hits" },
  { name: "The G.O.A.T", artist: "Ugasheni Ugqeqe", duration: 254, album: "Ugasheni Ugqeqe Hits" },
  { name: "Ighawe Lakho", artist: "Ugasheni Ugqeqe", duration: 278, album: "Ugasheni Ugqeqe Hits" },
  { name: "Khulumani phela", artist: "Thandazani", duration: 289, album: "Thandazani Collection" },
  { name: "Sasibaningi", artist: "Thandazani", duration: 301, album: "Thandazani Collection" },
  { name: "Ngicela ukuhlakanipha", artist: "Thandazani", duration: 274, album: "Thandazani Collection" }
];

// Function to add local music to UI
function addLocalMusicToUI(track) {
    const item = document.createElement('div');
    item.className = 'local-music-item';
    item.dataset.trackId = track.id;
    
    // Format duration
    const minutes = Math.floor(track.duration / 60);
    const seconds = Math.floor(track.duration % 60);
    const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Determine icon based on whether it's a predefined track or user-uploaded track
    const iconClass = track.fileUrl ? 'fa-file-audio' : 'fa-music';
    
    item.innerHTML = `
        <div class="local-music-item-info">
            <div class="local-music-item-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="local-music-item-details">
                <div class="local-music-item-title">${track.name}</div>
                <div class="local-music-item-artist">${track.artist} • ${track.album} • ${formattedDuration}</div>
            </div>
        </div>
        <div class="local-music-item-actions">
            <button class="play-local-track" title="Play">
                <i class="fas fa-play"></i>
            </button>
            <button class="remove-local-track" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add event listeners
    const playButton = item.querySelector('.play-local-track');
    playButton.addEventListener('click', () => {
        playLocalTrack(track);
    });
    
    const removeButton = item.querySelector('.remove-local-track');
    removeButton.addEventListener('click', () => {
        removeLocalTrack(track.id);
    });
    
    // Add to list
    localMusicList.appendChild(item);
}

// Function to add album to UI
function addAlbumToUI(album) {
    // Check if album section exists, if not create it
    let albumSection = document.querySelector('.album-section');
    if (!albumSection) {
        albumSection = document.createElement('section');
        albumSection.className = 'section album-section';
        albumSection.innerHTML = `
            <h2>Albums</h2>
            <div class="album-grid"></div>
        `;
        
        // Insert after local music section
        const localMusicSection = document.querySelector('.local-music-section');
        if (localMusicSection) {
            localMusicSection.parentNode.insertBefore(albumSection, localMusicSection.nextSibling);
        } else {
            // If local music section doesn't exist, add to main content
            document.querySelector('.main-content').appendChild(albumSection);
        }
    }
    
    // Create album item
    const albumItem = document.createElement('div');
    albumItem.className = 'album-item';
    albumItem.dataset.albumName = album.name;
    
    // Get track count
    const trackCount = album.tracks ? album.tracks.length : 0;
    
    albumItem.innerHTML = `
        <div class="album-cover">
            <i class="fas fa-music"></i>
        </div>
        <div class="album-title">${album.name}</div>
        <div class="album-artist">${album.artist}</div>
        <div class="album-tracks">${trackCount} tracks</div>
        <div class="album-content">
            <div class="album-tracks-list"></div>
        </div>
    `;
    
    // Add event listener to toggle album content
    albumItem.addEventListener('click', (e) => {
        // Don't toggle if clicking on a button inside the album content
        if (e.target.closest('.play-local-track') || e.target.closest('.remove-local-track')) {
            return;
        }
        
        const content = albumItem.querySelector('.album-content');
        content.classList.toggle('active');
    });
    
    // Add to album grid
    document.querySelector('.album-grid').appendChild(albumItem);
}

// Function to update album UI
function updateAlbumUI(album) {
    const albumItem = document.querySelector(`.album-item[data-album-name="${album.name}"]`);
    if (!albumItem) return;
    
    // Update track count
    const trackCount = album.tracks ? album.tracks.length : 0;
    albumItem.querySelector('.album-tracks').textContent = `${trackCount} tracks`;
    
    // Update tracks list
    const tracksList = albumItem.querySelector('.album-tracks-list');
    tracksList.innerHTML = '';
    
    album.tracks.forEach(track => {
        const trackItem = document.createElement('div');
        trackItem.className = 'local-music-item';
        trackItem.dataset.trackId = track.id;
        
        // Format duration
        const minutes = Math.floor(track.duration / 60);
        const seconds = Math.floor(track.duration % 60);
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Determine icon based on whether it's a predefined track or user-uploaded track
        const iconClass = track.fileUrl ? 'fa-file-audio' : 'fa-music';
        
        trackItem.innerHTML = `
            <div class="local-music-item-info">
                <div class="local-music-item-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="local-music-item-details">
                    <div class="local-music-item-title">${track.name}</div>
                    <div class="local-music-item-artist">${track.artist} • ${formattedDuration}</div>
                </div>
            </div>
            <div class="local-music-item-actions">
                <button class="play-local-track" title="Play">
                    <i class="fas fa-play"></i>
                </button>
                <button class="remove-local-track" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add event listeners
        const playButton = trackItem.querySelector('.play-local-track');
        playButton.addEventListener('click', () => {
            playLocalTrack(track);
        });
        
        const removeButton = trackItem.querySelector('.remove-local-track');
        removeButton.addEventListener('click', () => {
            removeLocalTrack(track.id);
        });
        
        // Add to tracks list
        tracksList.appendChild(trackItem);
    });
}

// Function to create shuffle section
function createShuffleSection() {
    // Check if shuffle section exists, if not create it
    let shuffleSection = document.querySelector('.shuffle-section');
    if (!shuffleSection) {
        shuffleSection = document.createElement('section');
        shuffleSection.className = 'section shuffle-section';
        shuffleSection.innerHTML = `
            <h2>Shuffle Play</h2>
            <div class="local-music-actions">
                <button id="shuffle-play" class="btn btn-primary">
                    <i class="fas fa-random"></i> Shuffle All Tracks
                </button>
            </div>
        `;
        
        // Insert after album section
        const albumSection = document.querySelector('.album-section');
        if (albumSection) {
            albumSection.parentNode.insertBefore(shuffleSection, albumSection.nextSibling);
        } else {
            // If album section doesn't exist, add after local music section
            const localMusicSection = document.querySelector('.local-music-section');
            if (localMusicSection) {
                localMusicSection.parentNode.insertBefore(shuffleSection, localMusicSection.nextSibling);
            } else {
                // If local music section doesn't exist, add to main content
                document.querySelector('.main-content').appendChild(shuffleSection);
            }
        }
        
        // Add event listener to shuffle button
        const shuffleButton = document.getElementById('shuffle-play');
        shuffleButton.addEventListener('click', () => {
            shufflePlay();
        });
    }
}

// Function to shuffle play all tracks
function shufflePlay() {
    if (localMusicLibrary.length === 0) {
        alert('No tracks available to shuffle play.');
        return;
    }
    
    // Get a random track
    const randomIndex = Math.floor(Math.random() * localMusicLibrary.length);
    const randomTrack = localMusicLibrary[randomIndex];
    
    // Play the random track
    playLocalTrack(randomTrack);
}

// Function to remove local track
function removeLocalTrack(trackId) {
    // Find track in library
    const trackIndex = localMusicLibrary.findIndex(track => track.id === trackId);
    if (trackIndex === -1) return;
    
    const track = localMusicLibrary[trackIndex];
    
    // If this track is currently playing, stop it
    if (currentTrack && currentTrack.id === trackId) {
        // Stop audio
        audioPlayer.pause();
        audioPlayer.src = '';
        currentTrack = null;
        
        // Reset player UI
        document.querySelector('.track-info h4').textContent = 'No track selected';
        document.querySelector('.track-info p').textContent = '';
        
        // Reset play button
        const playIcon = playBtn.querySelector('i');
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        
        // Reset progress
        progress.style.width = '0%';
    }
    
    // Remove from library
    localMusicLibrary.splice(trackIndex, 1);
    
    // Remove from UI
    const item = document.querySelector(`.local-music-item[data-track-id="${trackId}"]`);
    if (item) {
        item.remove();
    }
    
    // Update status
    localMusicStatus.textContent = `${localMusicLibrary.length} tracks from your music library`;
    
    // If it was a user-uploaded track with a file URL, revoke the object URL
    if (track.fileUrl) {
        URL.revokeObjectURL(track.fileUrl);
    }
    
    // Remove from album
    for (const album of albums) {
        const trackIndex = album.tracks.findIndex(t => t.id === trackId);
        if (trackIndex !== -1) {
            album.tracks.splice(trackIndex, 1);
            updateAlbumUI(album);
            break;
        }
    }
}

// Function to load predefined tracks
function loadPredefinedTracks() {
    // Update status
    if (localMusicStatus) {
        localMusicStatus.textContent = `Loading ${predefinedTracks.length} tracks from your music library...`;
    }
    
    // Create albums from predefined tracks
    const albumMap = {};
    
    // Process each predefined track
    predefinedTracks.forEach((trackInfo, index) => {
        // Create a track object
        const trackId = 'local-' + Date.now() + '-' + index;
        const track = {
            id: trackId,
            name: trackInfo.name,
            artist: trackInfo.artist,
            duration: trackInfo.duration,
            album: trackInfo.album,
            // We don't have actual file URLs for predefined tracks in this demo
            fileUrl: null
        };
        
        // Add to library
        localMusicLibrary.push(track);
        
        // Add to UI
        addLocalMusicToUI(track);
        
        // Add to album
        if (!albumMap[trackInfo.album]) {
            albumMap[trackInfo.album] = {
                name: trackInfo.album,
                artist: trackInfo.artist,
                tracks: []
            };
        }
        
        albumMap[trackInfo.album].tracks.push(track);
    });
    
    // Create albums
    for (const albumName in albumMap) {
        const album = albumMap[albumName];
        albums.push(album);
        addAlbumToUI(album);
        updateAlbumUI(album);
    }
    
    // Create shuffle section
    createShuffleSection();
    
    // Update status
    if (localMusicStatus) {
        localMusicStatus.textContent = `${localMusicLibrary.length} tracks from your music library`;
    }
}

// Event Listeners

// Profile Modal
profileIcon.addEventListener('click', () => {
    profileModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    profileModal.style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === profileModal) {
        profileModal.style.display = 'none';
    }
});

// Play/Pause Button
playBtn.addEventListener('click', () => {
    if (currentTrack) {
        if (audioPlayer.paused) {
            if (currentTrack.fileUrl) {
                audioPlayer.play();
            }
            const playIcon = playBtn.querySelector('i');
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
        } else {
            audioPlayer.pause();
            const playIcon = playBtn.querySelector('i');
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
        }
    }
});

// Initialize app
function initApp() {
    console.log('Initializing app...');
    
    // Initialize audio player
    if (!audioPlayer) {
        audioPlayer = new Audio();
    }
    
    // Initialize elements
    initializeElements();
    
    // Load predefined tracks
    loadPredefinedTracks();
    
    console.log('App initialized');
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

// Mock function for media playback (would be replaced with actual media player implementation)
function playMedia(mediaId, mediaType) {
    console.log(`Playing ${mediaType} with ID: ${mediaId}`);
    // This would connect to your actual media player implementation
}

// Mock function for downloading content
function downloadMedia(mediaId, mediaType) {
    console.log(`Downloading ${mediaType} with ID: ${mediaId}`);
    // This would handle the actual download functionality
}

// Mock function for adding to playlist
function addToPlaylist(mediaId, playlistId) {
    console.log(`Adding media ${mediaId} to playlist ${playlistId}`);
    // This would handle the actual playlist management
}

// Mock function for user authentication
function checkAuthStatus() {
    // This would check if the user is logged in
    return true; // Mock return value
}

// Check if user is authenticated
if (checkAuthStatus()) {
    console.log('User is authenticated');
} else {
    console.log('User is not authenticated, redirect to login page');
    // In a real app, you would redirect to the login page
    // window.location.href = 'login.html';
}