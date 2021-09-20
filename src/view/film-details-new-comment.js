import SmartView from './smart';

const createFilmDetailsNewCommentTemplate = (data) => {
  const { checkedEmotion } = data;

  return `<div class="film-details__new-comment">
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
          </div>`;
};

export default class FilmDetailsNewComment extends SmartView {
  constructor(film) {
    super();
    this._data = FilmDetailsNewComment.parseFilmToData(film);

    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);
    this._addCommentHandler = this._addCommentHandler.bind(this);
    this._checkedEmotion = null;

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsNewCommentTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setAddCommentHandler(this._callback.addComment);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('change', this._emotionChangeHandler);
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

  _addCommentHandler(evt) {
    if (evt.key === 'Enter' && evt.ctrlKey) {
      evt.preventDefault();
      const newCommentText = this.getElement().querySelector('.film-details__comment-input').value;
      this._callback.addComment(this._data.checkedEmotion, newCommentText);
    }
  }

  setAddCommentHandler(callback) {
    this._callback.addComment = callback;
    this.getElement().addEventListener('keydown', this._addCommentHandler);
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
