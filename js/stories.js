"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * Determine if the story is in currentUser's favorites list. If so, return
 * the filled in star. If not, return the empty star.
 */

function getFavoriteStar(story) {

  const isFavorite = currentUser.favorites.some(
    item => item.storyId === story.storyId);

  // let storyStar = `<a id="star-story-${story.storyId}" href="#">`;
  let $starLink = $(`<a>`, { id: `star-story-${story.storyId}`, href: "#" })
  let $starIcon;

  if (isFavorite) {
    $starIcon = $('<i class="bi bi-star-fill"></i>');
    $starLink.on('click', currentUser.unFavorite(story));
  } else {
    $starIcon = $('<i class="bi bi-star"></i>');
    $starLink.on('click', currentUser.addFavorite(story));
  }
  $starLink.append($starIcon);


  return $starLink.prop('outerHTML');
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">${getFavoriteStar(story)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


// TODO: Takes in form; data creates new story; displays story on the page
/** Called when user submits the "add a new story" form
 * Creates a new story and displays the story on the page
  */

async function createAndDisplayNewStory(evt) {
  evt.preventDefault();
  console.log('evt', evt);
  const author = $("#author-input").val();
  const title = $("#title-input").val();
  const url = $("#story-url-input").val();
  const storyData = {author, title, url};

  const newStory = await storyList.addStory(
    currentUser,
    storyData
  );
  $newStoryForm.trigger("reset");
  $newStoryForm.hide();
  $allStoriesList.prepend(generateStoryMarkup(newStory));

}

$newStoryForm.on('submit', createAndDisplayNewStory);


/** Get favorites list from server and display them on page */

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $favoritesList.empty();

  // loop through all of our favorite stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoritesList.append($story);
  }

  $favoritesList.show();
}