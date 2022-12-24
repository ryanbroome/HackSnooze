'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;
let favoriteStoryList;
/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}
// async function getAndShowFavoriteStoriesOnClick() {
//   favoriteStoryList = await StoryList.getFavoriteStories();
//   $storiesLoadingMsg.remove();

//   putFavoriteStoriesOnPage();
// }

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug('generateStoryMarkup', story);

  const hostName = story.getHostName();

  const showStar = Boolean(currentUser);

  return $(`  
  <li id="${story.storyId}">
  ${showDeleteBtn ? getDeleteBtnHTML() : ''}
  ${showStar ? getStarHTML(story, currentUser) : ''}
      <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
<<<<<<< HEAD
        <input class="story-favorite" type="checkbox" id="${story}"unchecked >Favorite</button><hr>  
=======
>>>>>>> favorite
      </li>
    `);
}

function getDeleteBtnHTML() {
  return `
  <span class="trash-can">
  <i class="fas fa-trash-alt"></i>
  </span>`;
}

function getStarHTML(story, user) {
  // debugger;
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? 'fas' : 'far';
  return `<span class="star">
  <i class="${starType} fa-star"></i>
</span>`;
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug('putStoriesOnPage');

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
function putFavoriteStoriesOnPage() {
  console.debug('putFavoriteStoriesOnPage');

  $favoriteStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  if (currentUser.favorites.length === 0) {
    $favoriteStoriesList.append('<h5>No favorites added!</h5>');
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStoriesList.append($story);
    }
    const localFaves = JSON.parse(localStorage.getItem('favorites'));
    console.log(localFaves);
    for (let story of localFaves) {
      const $favStory = generateStoryMarkup(story);
      $favoriteStoriesList.append($favStory);
    }
  }
  $allStoriesList.hide();

  $favoriteStoriesList.show();
}

async function submitStory(event) {
  console.debug('submitStory');
  event.preventDefault();

  const author = $('#story-form-author').val();
  const title = $('#story-form-title').val();
  const url = $('#story-form-url').val();
  const username = currentUser.username;
  const storyData = { author, title, url, username };

  const story = await storyList.addStory(currentUser, storyData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $storyForm.slideUp('slow');
  $storyForm.trigger('reset');
  $allStoriesList.show();
}
$storyForm.on('submit', submitStory);

function toggleFavorite(evt) {
  console.debug('toggleFavorite');
  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest('li');
  const storyId = $closestLi.attr('id');
  const story = storyList.stories.find((s) => s.storyId === storyId);
}

async function toggleStoryFavorite(evt) {
  console.debug('toggleStoryFavorite');

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest('li');
  const storyId = $closestLi.attr('id');
  const story = storyList.stories.find((s) => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass('fas')) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $tgt.closest('i').toggleClass('fas far');
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $tgt.closest('i').toggleClass('fas far');
  }
}

$storiesLists.on('click', '.star', toggleStoryFavorite);
