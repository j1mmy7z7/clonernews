import { fetchItem } from "./api.js";

export function renderPost(post) {
  if (!post || !post.title) return null;
  const postElement = document.createElement("article");
  postElement.className = "post";
  postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p class="post-meta">
            <i class="fas fa-user"></i> ${post.by || "Anonymous"} |
            <i class="fas fa-star"></i> ${post.score || 0} |
            <i class="fas fa-clock"></i> ${new Date(
              post.time * 1000
            ).toLocaleString()}
        </p>
        ${
          post.url
            ? `<a href="${post.url}" target="_blank"><i class="fas fa-external-link-alt"></i> Read More</a>`
            : ""
        }
        <div class="comments"></div>
    `;

  if (post.kids && post.kids.length > 0) {
    const commentsContainer = postElement.querySelector(".comments");
    const showCommentsButton = document.createElement("button");
    showCommentsButton.textContent = `Show Comments (${post.kids.length})`;
    showCommentsButton.className = "show-comments-btn";
    showCommentsButton.addEventListener("click", () =>
      loadComments(post.kids, commentsContainer)
    );
    commentsContainer.appendChild(showCommentsButton);
  }

  return postElement;
}

export function renderComment(comment, container, depth = 0) {
  if (!comment || !comment.text) return null;
  const commentElement = document.createElement("div");
  commentElement.className = "comment";
  commentElement.style.marginLeft = `${depth * 20}px`;
  commentElement.innerHTML = `
        <p>${comment.text}</p>
        <p class="comment-meta">
            <i class="fas fa-user"></i> ${comment.by || "Anonymous"} |
            <i class="fas fa-clock"></i> ${new Date(
              comment.time * 1000
            ).toLocaleString()}
        </p>
    `;

  container.appendChild(commentElement);

  if (comment.kids && comment.kids.length > 0) {
    const repliesContainer = document.createElement("div");
    repliesContainer.className = "replies";
    commentElement.appendChild(repliesContainer);

    const showRepliesButton = document.createElement("button");
    showRepliesButton.textContent = `Show Replies (${comment.kids.length})`;
    showRepliesButton.className = "show-replies-btn";
    showRepliesButton.addEventListener("click", () =>
      loadComments(comment.kids, repliesContainer, depth + 1)
    );
    commentElement.appendChild(showRepliesButton);
  }

  return commentElement;
}

async function loadComments(commentIds, container, depth = 0) {
  container.innerHTML = ""; // Clear existing content
  for (const commentId of commentIds) {
    const comment = await fetchItem(commentId);
    renderComment(comment, container, depth);
  }
}

export function renderJob(job) {
  if (!job || !job.title) return null;
  const jobElement = document.createElement("article");
  jobElement.className = "job";
  jobElement.innerHTML = `
        <h3>${job.title}</h3>
        <p class="item-meta">
            <i class="fas fa-briefcase"></i> Job |
            <i class="fas fa-user"></i> ${job.by || "Anonymous"} |
            <i class="fas fa-clock"></i> ${new Date(
              job.time * 1000
            ).toLocaleString()}
        </p>
        ${
          job.url
            ? `<a href="${job.url}" target="_blank"><i class="fas fa-external-link-alt"></i> Apply Now</a>`
            : ""
        }
        ${job.text ? `<div class="job-description">${job.text}</div>` : ""}
    `;
  return jobElement;
}

export function renderPoll(poll) {
  if (!poll || poll.type !== "poll" || !poll.title) return null;
  const pollElement = document.createElement("article");
  pollElement.className = "poll";
  pollElement.innerHTML = `
        <h3>${poll.title}</h3>
        <p class="item-meta">
            <i class="fas fa-poll"></i> Poll |
            <i class="fas fa-user"></i> ${poll.by || "Anonymous"} |
            <i class="fas fa-star"></i> ${poll.score || 0} |
            <i class="fas fa-clock"></i> ${new Date(
              poll.time * 1000
            ).toLocaleString()}
        </p>
        <div class="poll-options"></div>
    `;

  if (poll.parts && poll.parts.length > 0) {
    const optionsContainer = pollElement.querySelector(".poll-options");
    poll.parts.forEach(async (optionId) => {
      const option = await fetchItem(optionId);
      if (option && option.text) {
        const optionElement = document.createElement("div");
        optionElement.className = "poll-option";
        optionElement.innerHTML = `
                    <p>${option.text}</p>
                    <p class="option-score">Score: ${option.score || 0}</p>
                `;
        optionsContainer.appendChild(optionElement);
      }
    });
  }

  return pollElement;
}
