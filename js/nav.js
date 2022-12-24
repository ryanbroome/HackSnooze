'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug('navAllStories', evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);
/** Show favorite list of all stories when click site name */

function navShowFavoriteStories(evt) {
  console.debug('navShowFavoriteStories', evt);
  hidePageComponents();
  putFavoriteStoriesOnPage();
}

$body.on('click', '#nav-user-favorites', navShowFavoriteStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug('navLoginClick', evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug('updateNavOnLogin');
  $('.main-nav-links').show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// ** When  a user clicks on #nav-submit
// this navSubmitClick and below was unguided, curious to see what step 3 shows
function navSubmitClick(evt) {
  console.debug('navSubmitClick', evt);
  hidePageComponents();
  $storyForm.toggle();
}

$navSubmit.on('click', navSubmitClick);
