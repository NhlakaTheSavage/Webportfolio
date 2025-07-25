document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.querySelector('.search-input');
    const clearSearchIcon = document.querySelector('.clear-search-icon');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const recentSearchesSection = document.querySelector('.recent-searches');
    const browseAllSection = document.querySelector('.browse-all');
    const searchResultsSection = document.querySelector('.search-results');
    const removeSearchButtons = document.querySelectorAll('.remove-search-btn');
    const resultTracks = document.querySelectorAll('.result-track');
    const categoryItems = document.querySelectorAll('.category-item');
    
    // Search Input Functionality
    searchInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            clearSearchIcon.classList.add('visible');
            showSearchResults();
        } else {
            clearSearchIcon.classList.remove('visible');
            hideSearchResults();
        }
    });
    
    clearSearchIcon.addEventListener('click', function() {
        searchInput.value = '';
        clearSearchIcon.classList.remove('visible');
        hideSearchResults();
        searchInput.focus();
    });
    
    // Filter Buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter search results based on selected filter
            const filter = this.getAttribute('data-filter');
            filterSearchResults(filter);
        });
    });
    
    // Remove Recent Search Item
    removeSearchButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const searchItem = this.closest('.recent-search-item');
            removeRecentSearch(searchItem);
        });
    });
    
    // Result Track Click
    resultTracks.forEach(track => {
        track.addEventListener('click', function() {
            const trackTitle = this.querySelector('h4').textContent;
            const artistName = this.querySelector('p').textContent;
            const thumbnailUrl = this.querySelector('.result-track-img').style.backgroundImage;
            
            playTrack(trackTitle, artistName, thumbnailUrl);
        });
    });
    
    // Category Item Click
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            searchByCategory(category);
        });
    });
    
    // Functions
    function showSearchResults() {
        // Hide recent searches and browse all sections
        recentSearchesSection.style.display = 'none';
        browseAllSection.style.display = 'none';
        
        // Show search results section
        searchResultsSection.style.display = 'block';
        
        // Simulate search results (in a real app, this would fetch from an API)
        simulateSearchResults(searchInput.value);
    }
    
    function hideSearchResults() {
        // Show recent searches and browse all sections
        recentSearchesSection.style.display = 'block';
        browseAllSection.style.display = 'block';
        
        // Hide search results section
        searchResultsSection.style.display = 'none';
    }
    
    function filterSearchResults(filter) {
        // In a real app, this would filter the search results based on the selected filter
        console.log(`Filtering results by: ${filter}`);
        
        // For demo purposes, we'll just log the filter
        if (filter !== 'all' && searchResultsSection.style.display === 'block') {
            // Simulate filtering by hiding/showing different sections
            const sections = searchResultsSection.querySelectorAll('h2');
            sections.forEach(section => {
                const sectionTitle = section.textContent.toLowerCase();
                const sectionContent = section.nextElementSibling;
                
                if (filter === 'all' || sectionTitle.includes(filter)) {
                    section.style.display = 'block';
                    sectionContent.style.display = 'block';
                } else {
                    section.style.display = 'none';
                    sectionContent.style.display = 'none';
                }
            });
        }
    }
    
    function removeRecentSearch(searchItem) {
        // Animate removal
        searchItem.style.opacity = '0';
        searchItem.style.height = `${searchItem.offsetHeight}px`;
        
        setTimeout(() => {
            searchItem.style.height = '0';
            searchItem.style.padding = '0';
            searchItem.style.margin = '0';
            
            setTimeout(() => {
                searchItem.remove();
                
                // Check if there are no more recent searches
                const remainingSearches = document.querySelectorAll('.recent-search-item');
                if (remainingSearches.length === 0) {
                    recentSearchesSection.style.display = 'none';
                }
            }, 300);
        }, 300);
    }
    
    function playTrack(title, artist, thumbnail) {
        // Update player bar
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
        
        // Show toast notification
        showToast(`Now playing: ${title} by ${artist}`);
        
        // In a real app, this would trigger the actual audio playback
        console.log(`Playing: ${title} by ${artist}`);
    }
    
    function searchByCategory(category) {
        // Simulate searching by category
        searchInput.value = category;
        clearSearchIcon.classList.add('visible');
        showSearchResults();
        
        // Show toast notification
        showToast(`Browsing ${category} music`);
    }
    
    function simulateSearchResults(query) {
        // In a real app, this would fetch results from an API
        console.log(`Searching for: ${query}`);
        
        // Update the top result title
        const topResultTitle = document.querySelector('.top-result h3');
        const topResultType = document.querySelector('.top-result .result-type');
        
        if (topResultTitle && topResultType) {
            topResultTitle.textContent = query;
            // Determine result type based on query (just for demo)
            if (query.toLowerCase().includes('playlist')) {
                topResultType.textContent = 'Playlist';
            } else if (query.toLowerCase().includes('album')) {
                topResultType.textContent = 'Album';
            } else {
                topResultType.textContent = 'Artist';
            }
        }
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
});