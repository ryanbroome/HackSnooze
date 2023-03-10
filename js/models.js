'use strict';

const BASE_URL = 'https://hack-or-snooze-v3.herokuapp.com';

/******************************************************************************
 * Story: a single story in the system
 */

class Story {
  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName = function () {
    return 'herokuapp.com';
  };
}

/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: 'GET',
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map((story) => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */
  // NEED TO HAVE REVIEWED
  async addStory(user, newStory) {
    const res = await axios.post(`${BASE_URL}/stories`, {
      story: {
        author: `${newStory.author}`,
        title: `${newStory.title}`,
        url: `${newStory.url}`,
      },
      token: `${user.loginToken}`,
    });
    const story = new Story(res.data.story);
    this.stories.unshift(story);
    user.ownStories.unshift(story);
    return story;
  }
  async removeStory(user, storyId) {
    const token = user.loginToken;
    await axios.delete(`${BASE_URL}/stories/${storyId}`, { token: user.loginToken });
  }
}

/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({ username, name, createdAt, favorites = [], ownStories = [] }, token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map((s) => new Story(s));
    this.ownStories = ownStories.map((s) => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }
<<<<<<< HEAD
  getHostName() {
    return new URL(this.url).host;
  }
  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */
=======
  // get host name
  getHostName(fullURL) {
    function url_domain(data) {
      const a = document.createElement('a');
      a.href = data;
      return a.hostname;
    }
    return url_domain(fullURL);
  }
>>>>>>> favorite

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: 'POST',
      data: { user: { username, password, name } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }
<<<<<<< HEAD
=======

>>>>>>> favorite
  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: 'POST',
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: 'GET',
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories,
        },
        token
      );
    } catch (err) {
      console.error('loginViaStoredCredentials failed', err);
      return null;
    }
  }
<<<<<<< HEAD

  async addFavorite(story) {
    this.favorites.push(story);
    await this._addOrRemoveFavorite('add', story);
  }

  /** Remove a story to the list of user favorites and update the API
   * - story: the Story instance to remove from favorites
   */

  async removeFavorite(story) {
    this.favorites = this.favorites.filter((s) => s.storyId !== story.storyId);
    await this._addOrRemoveFavorite('remove', story);
  }

  /** Update API with favorite/not-favorite.
   *   - newState: "add" or "remove"
   *   - story: Story instance to make favorite / not favorite
   * */

  async _addOrRemoveFavorite(newState, story) {
    const method = newState === 'add' ? 'POST' : 'DELETE';
    const token = this.loginToken;
    await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
      method: method,
      data: { token },
    });
  }

  /** Return true/false if given Story instance is a favorite of this user. */

=======
  // /** Add a story to the list of user favorites and update the API
  //  * - story: the Story instance to add to favorites
  //  */
  async addFavorite(story) {
    this.favorites.push(story);
    const method = 'POST';
    const token = this.loginToken;
    const res = await axios.post(`https://private-anon-f6bcaa0ecb-hackorsnoozev3.apiary-mock.com/users/${this.username}/favorites/${story.storyId}`, { token: token, story: story });
  }
  // /** Remove a story to the list of user favorites and update the API
  //  * - story: the Story instance to remove from favorites
  //  */
  async removeFavorite(story) {
    this.favorites = this.favorites.filter((s) => s.storyId !== story.storyId);
    const token = this.loginToken;
    const res = await axios.delete(`https://private-anon-f6bcaa0ecb-hackorsnoozev3.apiary-mock.com/users/${this.username}/favorites/${story.storyId}`, { data: { token } });
  }
  async getUserFavorites() {
    const username = currentUser.username;
    const token = currentUser.loginToken;
    const res = await axios.get(`${BASE_URL}/users/${username}`, { params: { token } });
    // const favorites = res.data.user.favorites;
    return res.data.user.favorites;
  }
>>>>>>> favorite
  isFavorite(story) {
    return this.favorites.some((s) => s.storyId === story.storyId);
  }
}
