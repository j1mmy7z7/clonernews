import { fetchLatestItemIds, fetchItem } from './api.js';
import { renderPost, renderComment } from './renderer.js';
import { throttle } from './utils.js';

let lastLoadedItemId = null;
let isLoading = false;

async function loadMorePosts() {
    if (isLoading) return;
    isLoading = true;
    
    document.getElementById('loader').style.display = 'block';
    document.getElementById('loadMore').style.display = 'none';

    const itemIds = await fetchLatestItemIds();
    const startIndex = lastLoadedItemId ? itemIds.indexOf(lastLoadedItemId) + 1 : 0;
    const endIndex = Math.min(startIndex + 10, itemIds.length);

    const postsContainer = document.getElementById('posts');

    for (let i = startIndex; i < endIndex; i++) {
        const post = await fetchItem(itemIds[i]);
        if (post.type === 'story' || post.type === 'job' || post.type === 'poll') {
            const postElement = renderPost(post);
            postsContainer.appendChild(postElement);
        }
    }

    lastLoadedItemId = itemIds[endIndex - 1];
    isLoading = false;
    document.getElementById('loader').style.display = 'none';
    document.getElementById('loadMore').style.display = 'block';
}

async function updateLiveData() {
    const itemIds = await fetchLatestItemIds();
    const latestPost = await fetchItem(itemIds[0]);
    const latestPostElement = document.getElementById('latestPost');
    latestPostElement.innerHTML = `
        <h3>${latestPost.title}</h3>
        <p class="post-meta">
            <i class="fas fa-user"></i> ${latestPost.by} | 
            <i class="fas fa-star"></i> ${latestPost.score} | 
            <i class="fas fa-clock"></i> ${new Date(latestPost.time * 1000).toLocaleString()}
        </p>
    `;
}

function init() {
    const loadMoreButton = document.getElementById('loadMore');
    loadMoreButton.addEventListener('click', throttle(loadMorePosts, 1000));

    // Initial load
    loadMorePosts();

    // Set up live updates
    setInterval(throttle(updateLiveData, 5000), 5000);
}

// Start the application
init();