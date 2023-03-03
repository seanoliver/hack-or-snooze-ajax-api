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
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
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
 * Creates a new story and adds it to the story list.
  */

async function createAndDisplayNewStory(evt) {
  evt.preventDefault();
  console.log('evt', evt);
  // TODO: Save this
  await storyList.addStory(
    currentUser,
    {
      author: $("#author-input").val(),
      title: $("#title-input").val(),
      url: $("#story-url-input").val(),
    }
  );
  $newStoryForm.trigger("reset");
  $newStoryForm.hide();
  //TODO: Call generateStoryMarkup and prepend to the story list in the DOM
  putStoriesOnPage();

}

$newStoryForm.on('submit', createAndDisplayNewStory);