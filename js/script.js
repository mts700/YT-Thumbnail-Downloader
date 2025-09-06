// DOM Elements
const youtubeUrlInput = document.getElementById('youtube-url');
const getThumbnailsBtn = document.getElementById('get-thumbnails');
const clearBtn = document.getElementById('clear-btn');
const errorMessage = document.getElementById('error-message');
const loader = document.getElementById('loader');
const thumbnailsContainer = document.getElementById('thumbnails-container');
const thumbnailsGrid = document.getElementById('thumbnails-grid');

// Extract YouTube Video ID from various URL formats including Shorts
function extractVideoId(url) {
    // Regular expression to match various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
}

// Generate thumbnail URLs from video ID
function generateThumbnailLinks(videoId) {
    return {
        maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        sddefault: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        hqdefault: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
}



// Copy URL to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('URL copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Create thumbnail card
function createThumbnailCard(quality, url, videoId) {
    const card = document.createElement('div');
    card.className = 'thumbnail-card';
    
    const qualityLabels = {
        maxres: 'Full HD',
        sddefault: 'Standard Quality',
        hqdefault: 'Normal Quality'
    };
    
    const filename = `youtube_thumbnail_${quality}_${videoId}.jpg`;
    
    card.innerHTML = `
        <img src="${url}" alt="${quality} thumbnail" class="thumbnail-image">
        <div class="thumbnail-details">
            <div class="thumbnail-quality">${qualityLabels[quality]}</div>
            <div class="thumbnail-actions">
                <button class="btn btn-primary btn-sm download-btn" data-url="${url}" data-filename="${filename}">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="btn btn-secondary btn-sm copy-btn" data-url="${url}">
                    <i class="fas fa-copy"></i> Copy URL
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Get Thumbnails button click handler
getThumbnailsBtn.addEventListener('click', () => {
    const youtubeUrl = youtubeUrlInput.value.trim();
    
    if (!youtubeUrl) {
        errorMessage.textContent = 'Please enter a YouTube URL';
        errorMessage.style.display = 'block';
        return;
    }
    
    const videoId = extractVideoId(youtubeUrl);
    
    if (!videoId) {
        errorMessage.textContent = 'Invalid YouTube URL. Please check and try again.';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Hide error message if previously shown
    errorMessage.style.display = 'none';
    
    // Show loader
    loader.style.display = 'block';
    thumbnailsContainer.style.display = 'none';
    
    // Generate thumbnail URLs
    const thumbnails = generateThumbnailLinks(videoId);
    
    // Clear previous thumbnails
    thumbnailsGrid.innerHTML = '';
    
    // Create and append thumbnail cards in the desired order
    const qualities = ['maxres', 'sddefault', 'hqdefault'];
    
    // Use setTimeout to simulate loading and allow the UI to update
    setTimeout(() => {
        qualities.forEach(quality => {
            const card = createThumbnailCard(quality, thumbnails[quality], videoId);
            thumbnailsGrid.appendChild(card);
        });
        
        // Hide loader and show thumbnails container
        loader.style.display = 'none';
        thumbnailsContainer.style.display = 'block';
    }, 1000);
});

// Clear button click handler
clearBtn.addEventListener('click', () => {
    youtubeUrlInput.value = '';
    thumbnailsContainer.style.display = 'none';
    errorMessage.style.display = 'none';
});

// Event delegation for download and copy buttons
document.addEventListener('click', (e) => {
    // Download button
    if (e.target.classList.contains('download-btn') || e.target.closest('.download-btn')) {
        const btn = e.target.classList.contains('download-btn') ? e.target : e.target.closest('.download-btn');
        const url = btn.getAttribute('data-url');
        window.open(url, '_blank');
    }
    
    // Copy URL button
    if (e.target.classList.contains('copy-btn') || e.target.closest('.copy-btn')) {
        const btn = e.target.classList.contains('copy-btn') ? e.target : e.target.closest('.copy-btn');
        const url = btn.getAttribute('data-url');
        copyToClipboard(url);
    }
});

// Allow Enter key to trigger thumbnail generation
youtubeUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getThumbnailsBtn.click();
    }
});

// Pre-fill with a sample URL for testing
youtubeUrlInput.value = 'https://www.youtube.com/watch?v=X-Lsz7G_SYM';