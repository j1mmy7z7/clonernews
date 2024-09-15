import { fetchItem } from './api.js';

export function renderPost(post) {
    const postElement = document.createElement('article');
    postElement.className = 'post';
    postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p class="post-meta">
            <i class="fas fa-user"></i> ${post.by} | 
            <i class="fas fa-star"></i> ${post.score} | 
            <i class="fas fa-clock"></i> ${new Date(post.time * 1000).toLocaleString()}
        </p>
        ${post.url ? `<a href="${post.url}" target="_blank"><i class="fas fa-external-link-alt"></i> Read More</a>` : ''}
        <div class="comments"></div>
    `;

    if (post.kids && post.kids.length > 0) {
        const commentsContainer = postElement.querySelector('.comments');
        post.kids.forEach(async (commentId) => {
            const comment = await fetchItem(commentId);
            renderComment(comment, commentsContainer);
        });
    }

    return postElement;
}

export function renderComment(comment, container) {
    if (!comment.text) return; // Skip deleted comments

    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
        <p>${comment.text}</p>
        <p class="post-meta">
            <i class="fas fa-user"></i> ${comment.by} | 
            <i class="fas fa-clock"></i> ${new Date(comment.time * 1000).toLocaleString()}
        </p>
    `;

    container.appendChild(commentElement);

    if (comment.kids && comment.kids.length > 0) {
        comment.kids.forEach(async (childCommentId) => {
            const childComment = await fetchItem(childCommentId);
            renderComment(childComment, commentElement);
        });
    }
}