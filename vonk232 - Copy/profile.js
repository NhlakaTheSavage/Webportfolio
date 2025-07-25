document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const editProfileBtn = document.querySelector('.btn-primary');
    const editProfileModal = document.getElementById('edit-profile-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const profileForm = document.getElementById('profile-form');
    const profileNavLinks = document.querySelectorAll('.profile-nav-links li a');
    const recentTrackPlayBtns = document.querySelectorAll('.recent-track-play');
    const followBtns = document.querySelectorAll('.friend-item .btn-primary');
    const createPlaylistBtn = document.querySelector('.btn-outline');
    
    // Edit Profile Modal
    editProfileBtn.addEventListener('click', function() {
        editProfileModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            editProfileModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    });
    
    // Close modal when clicking outside of modal content
    editProfileModal.addEventListener('click', function(e) {
        if (e.target === editProfileModal) {
            editProfileModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Profile Form Submission
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('profile-name').value;
        const bio = document.getElementById('profile-bio').value;
        
        // Update profile info
        document.querySelector('.profile-details h1').textContent = name;
        document.querySelector('.profile-bio p').textContent = bio;
        
        // Show success message
        showToast('Profile updated successfully');
        
        // Close modal
        editProfileModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Profile Navigation
    profileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            profileNavLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Get section id from href
            const sectionId = this.getAttribute('href').substring(1);
            
            // Simulate section change (in a real app, this would show/hide sections)
            console.log(`Navigating to section: ${sectionId}`);
            showToast(`Viewing ${sectionId}`);
        });
    });
    
    // Recent Track Play Buttons
    recentTrackPlayBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const track = this.closest('.recent-track');
            const title = track.querySelector('h4').textContent;
            const artist = track.querySelector('p').textContent;
            const thumbnail = track.querySelector('.recent-track-img').style.backgroundImage;
            
            // Update player bar
            updatePlayerBar(title, artist, thumbnail);
        });
    });
    
    // Follow Buttons
    followBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const friendItem = this.closest('.friend-item');
            const friendName = friendItem.querySelector('h4').textContent;
            
            if (this.textContent === 'Follow') {
                this.textContent = 'Following';
                this.classList.remove('btn-primary');
                this.classList.add('btn-secondary');
                
                // Update followers count
                const followersCount = document.querySelector('.profile-stats .stat:nth-child(2) .stat-value');
                followersCount.textContent = parseInt(followersCount.textContent) + 1;
                
                showToast(`You are now following ${friendName}`);
                
                // Add to activity feed
                addActivityItem(`You followed ${friendName}`);
            } else {
                this.textContent = 'Follow';
                this.classList.remove('btn-secondary');
                this.classList.add('btn-primary');
                
                // Update followers count
                const followersCount = document.querySelector('.profile-stats .stat:nth-child(2) .stat-value');
                followersCount.textContent = parseInt(followersCount.textContent) - 1;
                
                showToast(`You unfollowed ${friendName}`);
            }
        });
    });
    
    // Create Playlist Button
    createPlaylistBtn.addEventListener('click', function() {
        // In a real app, this would open a modal to create a new playlist
        const playlistName = prompt('Enter playlist name:');
        
        if (playlistName && playlistName.trim() !== '') {
            // Update playlists count
            const playlistsCount = document.querySelector('.profile-stats .stat:nth-child(1) .stat-value');
            playlistsCount.textContent = parseInt(playlistsCount.textContent) + 1;
            
            // Add new playlist to grid
            addNewPlaylist(playlistName);
            
            // Add to activity feed
            addActivityItem(`You created a new playlist "${playlistName}"`);
            
            showToast(`Playlist "${playlistName}" created`);
        }
    });
    
    // Functions
    function updatePlayerBar(title, artist, thumbnail) {
        const playerThumbnail = document.querySelector('.player-bar .thumbnail');
        const playerTitle = document.querySelector('.player-bar .track-info h4');
        const playerArtist = document.querySelector('.player-bar .track-info p');
        const playButton = document.querySelector('.play-btn i');
        
        playerThumbnail.style.backgroundImage = thumbnail;
        playerTitle.textContent = title;
        playerArtist.textContent = artist;
        
        // Change play button to pause
        playButton.classList.remove('fa-play');
        playButton.classList.add('fa-pause');
        
        showToast(`Now playing: ${title} by ${artist}`);
    }
    
    function addNewPlaylist(name) {
        const mediaGrid = document.querySelector('#playlists .media-grid');
        
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        
        // Generate a random color for the playlist cover
        const colors = ['#E13300', '#1E3264', '#8D67AB', '#E8115B', '#148A08', '#BC5900'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        mediaItem.innerHTML = `
            <div class="media-image" style="background-color: ${randomColor};"></div>
            <h4>${name}</h4>
            <p>0 tracks</p>
        `;
        
        mediaGrid.prepend(mediaItem);
        
        // Add click event to the new playlist
        mediaItem.addEventListener('click', function() {
            window.location.href = 'playlist.html';
        });
    }
    
    function addActivityItem(content) {
        const activityFeed = document.querySelector('.activity-feed');
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        activityItem.innerHTML = `
            <div class="activity-avatar" style="background-image: url('https://via.placeholder.com/40');"></div>
            <div class="activity-content">
                <p><strong>You</strong> ${content}</p>
                <span class="activity-time">Just now</span>
            </div>
        `;
        
        activityFeed.prepend(activityItem);
    }
    
    function showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
            
            // Add toast styles if not in CSS
            if (!document.querySelector('#toast-styles')) {
                const style = document.createElement('style');
                style.id = 'toast-styles';
                style.textContent = `
                    .toast {
                        position: fixed;
                        bottom: 100px;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: #1DB954;
                        color: white;
                        padding: 12px 24px;
                        border-radius: 30px;
                        font-size: 14px;
                        z-index: 1000;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }
                    .toast.show {
                        opacity: 1;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Set message and show toast
        toast.textContent = message;
        toast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Make media items clickable
    const mediaItems = document.querySelectorAll('.media-item');
    mediaItems.forEach(item => {
        item.addEventListener('click', function() {
            window.location.href = 'playlist.html';
        });
    });
});