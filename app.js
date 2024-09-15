import { fetchLatestItemIds, fetchItem } from "./api.js";
import { renderPost, renderJob, renderPoll } from "./renderer.js";
import { throttle } from "./utils.js";

let lastLoadedItemId = null;
let isLoading = false;
let currentPage = "stories"; // Default page

async function loadMoreItems() {
  if (isLoading) return;
  isLoading = true;
  document.getElementById("loader").style.display = "block";
  document.getElementById("loadMore").style.display = "none";

  const itemIds = await fetchLatestItemIds(currentPage);
  const startIndex = lastLoadedItemId
    ? itemIds.indexOf(lastLoadedItemId) + 1
    : 0;
  const endIndex = Math.min(startIndex + 10, itemIds.length);
  const container = document.getElementById("items");

  for (let i = startIndex; i < endIndex; i++) {
    const item = await fetchItem(itemIds[i]);
    let itemElement;
    switch (currentPage) {
      case "stories":
        itemElement = renderPost(item);
        break;
      case "jobs":
        itemElement = renderJob(item);
        break;
      case "polls":
        itemElement = renderPoll(item);
        break;
    }
    if (itemElement) {
      container.appendChild(itemElement);
    }
  }

  lastLoadedItemId = itemIds[endIndex - 1];
  isLoading = false;
  document.getElementById("loader").style.display = "none";
  document.getElementById("loadMore").style.display =
    itemIds.length > endIndex ? "block" : "none";
}

async function updateLiveData() {
  const itemIds = await fetchLatestItemIds(currentPage);
  if (itemIds.length > 0) {
    const latestItem = await fetchItem(itemIds[0]);
    const latestItemElement = document.getElementById("latestItem");
    latestItemElement.innerHTML = `
            <h3>${latestItem.title || "New Item"}</h3>
            <p class="item-meta">
                <i class="fas fa-user"></i> ${latestItem.by} |
                <i class="fas fa-clock"></i> ${new Date(
                  latestItem.time * 1000
                ).toLocaleString()}
            </p>
        `;
  }
}

function changePage(page) {
  currentPage = page;
  lastLoadedItemId = null;
  document.getElementById("items").innerHTML = "";
  loadMoreItems();
  updateActiveNavLink();
}

function updateActiveNavLink() {
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    if (link.getAttribute("data-page") === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function init() {
  const loadMoreButton = document.getElementById("loadMore");
  loadMoreButton.addEventListener("click", throttle(loadMoreItems, 1000));

  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      changePage(e.target.getAttribute("data-page"));
    });
  });

  // Initial load
  loadMoreItems();

  // Set up live updates
  setInterval(throttle(updateLiveData, 5000), 5000);
}

// Start the application
init();
