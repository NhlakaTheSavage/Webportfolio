// DOM Elements
const trackItems = document.querySelectorAll('.track-item');
const playAllBtn = document.querySelector('.play-all-btn');
const likeBtn = document.querySelector('.like-btn');
const downloadBtn = document.querySelector('.download-btn');
const shareBtn = document.querySelector('.share-btn');
const moreBtn = document.querySelector('.more-btn');
const trackActionBtns = document.querySelectorAll('.track-action-btn');
const addToPlaylistModal = document.getElementById('add-to-playlist-modal');
const closeModal = document.querySelector('.close-modal');
const addBtns = document.querySelectorAll('.add-btn');
const newPlaylistBtn = document.querySelector('.new-playlist-btn');

// Current track being added to playlist
let currentTrack = null;

// Event Listeners

// Track Item Click
trackItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
        // Don't trigger if clicking on action buttons
        if (e.target.closest('.track-action-btn')) {
            return;
        }
        
        // Remove active class from all tracks
        trackItems.forEach(track => track.classList.remove('active'));
        
        // Add active class to clicked track
        item.classList.add('active');
        
        // Update player bar
        const trackName = item.querySelector('.track-name').textContent;
        const artistName = item.querySelector('.track-artist').textContent;
        const trackImg = item.querySelector('.track-img').style.backgroundImage;
        
        document.querySelector('.now-playing .track-info h4').textContent = trackName;
        document.querySelector('.now-playing .track-info p').textContent = artistName;
        document.querySelector('.now-playing .thumbnail').style.backgroundImage = trackImg;
        
        // Update track number to show playing icon
        const trackNumbers = document.querySelectorAll('.track-number');
        trackNumbers.forEach((num, i) => {
            if (i === index) {
                num.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                num.textContent = i + 1;
            }
        });
        
        // Change play button to pause
        const playIcon = document.querySelector('.play-btn i');
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
        
        // Here you would also play the actual audio
        console.log(`Playing track: ${trackName} by ${artistName}`);
    });
});

// Play All Button
playAllBtn.addEventListener('click', () => {
    // Play the first track
    trackItems[0].click();
});

// Like Button
likeBtn.addEventListener('click', () => {
    likeBtn.classList.toggle('active');
    
    if (likeBtn.classList.contains('active')) {
        likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
        showToast('Playlist added to your Liked Songs');
    } else {
        likeBtn.innerHTML = '<i class="far fa-heart"></i>';
        showToast('Removed from your Liked Songs');
    }
});

// Download Button
downloadBtn.addEventListener('click', () => {
    showToast('Downloading playlist...');
    
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
            showToast(`Downloading playlist... ${progress}%`);
        } else {
            clearInterval(interval);
            showToast('Playlist downloaded successfully!');
        }
    }, 500);
});

// Share Button
shareBtn.addEventListener('click', () => {
    // Create a temporary input to copy the URL
    const tempInput = document.createElement('input');
    tempInput.value = window.location.href;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showToast('Playlist link copied to clipboard');
});

// More Button
moreBtn.addEventListener('click', () => {
    showToast('More options');
    // Here you would show a dropdown menu with more options
});

// Track Action Buttons
trackActionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering track item click
        
        const trackItem = btn.closest('.track-item');
        const trackName = trackItem.querySelector('.track-name').textContent;
        
        // Like button
        if (btn.querySelector('i').classList.contains('fa-heart')) {
            btn.classList.toggle('active');
            
            if (btn.classList.contains('active')) {
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                showToast(`Added "${trackName}" to your Liked Songs`);
            } else {
                btn.innerHTML = '<i class="far fa-heart"></i>';
                showToast(`Removed "${trackName}" from your Liked Songs`);
            }
        }
        
        // Add to playlist button
        if (btn.querySelector('i').classList.contains('fa-plus')) {
            currentTrack = trackName;
            addToPlaylistModal.style.display = 'flex';
        }
        
        // More options button
        if (btn.querySelector('i').classList.contains('fa-ellipsis-h')) {
            showToast(`More options for "${trackName}"`);
            // Here you would show a dropdown menu with more options
        }
    });
});

// Close Modal
closeModal.addEventListener('click', () => {
    addToPlaylistModal.style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === addToPlaylistModal) {
        addToPlaylistModal.style.display = 'none';
    }
});

// Add to Playlist Buttons
addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const playlistName = btn.closest('.playlist-option').querySelector('h4').textContent;
        showToast(`Added "${currentTrack}" to "${playlistName}"`);
        addToPlaylistModal.style.display = 'none';
    });
});

// Create New Playlist Button
newPlaylistBtn.addEventListener('click', () => {
    showToast('Create a new playlist');
    // Here you would show a form to create a new playlist
});

// Helper Functions

// Show toast notification
function showToast(message) {
    // Check if toast container exists
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        // Create toast container if it doesn't exist
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '1000';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.backgroundColor = '#1DB954';
    toast.style.color = '#fff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '4px';
    toast.style.marginTop = '10px';
    toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Show toast with animation
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            toastContainer.removeChild(toast);
            
            // Remove container if empty
            if (toastContainer.children.length === 0) {
                document.body.removeChild(toastContainer);
            }
        }, 300);
    }, 3000);
}

// Drag and Drop Functionality for Playlist Reordering
let draggedItem = null;

trackItems.forEach(item => {
    // Make items draggable
    item.setAttribute('draggable', true);
    
    // Drag start event
    item.addEventListener('dragstart', function() {
        draggedItem = this;
        setTimeout(() => {
            this.style.opacity = '0.5';
        }, 0);
    });
    
    // Drag end event
    item.addEventListener('dragend', function() {
        setTimeout(() => {
            this.style.opacity = '1';
            draggedItem = null;
        }, 0);
    });
    
    // Drag over event
    item.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    // Drag enter event
    item.addEventListener('dragenter', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '#333';
    });
    
    // Drag leave event
    item.addEventListener('dragleave', function() {
        this.style.backgroundColor = '';
    });
    
    // Drop event
    item.addEventListener('drop', function(e) {
        e.preventDefault();
        if (draggedItem !== this) {
            const trackList = document.querySelector('.track-list');
            const items = document.querySelectorAll('.track-item');
            const draggedIndex = Array.from(items).indexOf(draggedItem);
            const droppedIndex = Array.from(items).indexOf(this);
            
            if (draggedIndex < droppedIndex) {
                trackList.insertBefore(draggedItem, this.nextSibling);
            } else {
                trackList.insertBefore(draggedItem, this);
            }
            
            // Update track numbers
            updateTrackNumbers();
            
            showToast('Playlist order updated');
        }
        this.style.backgroundColor = '';
    });
});

// Update track numbers after reordering
function updateTrackNumbers() {
    const items = document.querySelectorAll('.track-item');
    items.forEach((item, index) => {
        const trackNumber = item.querySelector('.track-number');
        if (!trackNumber.querySelector('i')) {
            trackNumber.textContent = index + 1;
        }
    });
}