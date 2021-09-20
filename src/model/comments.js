export default class Comments {
  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        id: comment['id'],
        author: comment['author'],
        emotion: comment['emotion'],
        text: comment['comment'],
        date: comment['date'],
      },
    );

    delete comment['id'];
    delete comment['author'];
    delete comment['emotion'];
    delete comment['comment'];
    delete comment['date'];

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        ['emotion']: comment.emotion,
        ['comment']: comment.text,
      },
    );

    delete comment.id;
    delete comment.author;
    delete comment.emotion;
    delete comment.text;
    delete comment.date;

    return adaptedComment;
  }
}
