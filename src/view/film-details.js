import dayjs from 'dayjs';
import SmartView from './smart';

const createFilmDetailsPopupTemplate = (data) => {
  const {poster, ageRating, title, alternativeTitle, totalRating, director, writers, actors, releaseDate, runtime, releaseCountry, genres, description, isInWatchList, isAlreadyWatched, isFavorite, comments, checkedEmotion} = data;

  const date = dayjs(releaseDate).format('DD MMMM YYYY');

  const defineButtonActiveState = (condition) => {
    if (condition) {
      return 'film-details__control-button--active';
    }
  };

  const genresHeading = genres.length > 1 ? 'Genres' : 'Genre';

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="${title} poster">

            <p class="film-details__age">${ageRating}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${date}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${runtime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genresHeading}</td>
                <td class="film-details__cell">
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${defineButtonActiveState(isInWatchList)}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${defineButtonActiveState(isAlreadyWatched)}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${defineButtonActiveState(isFavorite)}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${checkedEmotion ? `<img src="images/emoji/${checkedEmotion}.png" width="55" height="55" alt="emoji-${checkedEmotion}">` : ''}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmDetailsPopup extends SmartView {
  constructor(film) {
    super();
    this._data = FilmDetailsPopup.parseFilmToData(film);

    this._addToWatchListClickHandler = this._addToWatchListClickHandler.bind(this);
    this._markAsWatchedClickHandler = this._markAsWatchedClickHandler.bind(this);
    this._favouriteClickHandler = this._favouriteClickHandler.bind(this);

    this._closeFilmDetailsClickHandler = this._closeFilmDetailsClickHandler.bind(this);

    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);
    this._checkedEmotion = null;

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsPopupTemplate(this._data);
  }

  restoreHandlers() {
    this.setAddToWatchListClickHandler(this._callback.addToWatchListClick);
    this.setMarkAsWatchedClickHandler(this._callback._markAsWatchedClick);
    this.setFavouriteClickHandler(this._callback._favouriteClick);
    this.setCloseFilmDetailsClickHandler(this._callback.closeFilmDetailsClick);

    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('change', this._emotionChangeHandler);
  }

  _addToWatchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchListClick();
  }

  _markAsWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback._markAsWatchedClick();
  }

  _favouriteClickHandler(evt) {
    evt.preventDefault();
    this._callback._favouriteClick();
  }

  _closeFilmDetailsClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeFilmDetailsClick();
  }

  setAddToWatchListClickHandler(callback) {
    this._callback.addToWatchListClick = callback;

    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._addToWatchListClickHandler);
  }

  setMarkAsWatchedClickHandler(callback) {
    this._callback._markAsWatchedClick = callback;

    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._markAsWatchedClickHandler);
  }

  setFavouriteClickHandler(callback) {
    this._callback._favouriteClick = callback;

    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favouriteClickHandler);
  }

  setCloseFilmDetailsClickHandler(callback) {
    this._callback.closeFilmDetailsClick = callback;

    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeFilmDetailsClickHandler);
  }

  _onEmotionChange(emotion) {
    this.updateData({
      checkedEmotion: emotion,
    });
  }

  _emotionChangeHandler(evt) {
    if (evt.target.matches('input[type="radio"]')) {
      this._onEmotionChange(evt.target.value);
    }
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        checkedEmotion: null,
      },
    );
  }
}
