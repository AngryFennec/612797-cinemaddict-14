const MAX_DESCRIPTION = 140;

export const PopupAction = {
  UPDATE_MOVIE: 'updateMovie',
  ADD_COMMENT: 'addComment',
  DELETE_COMMENT: 'deleteComment',
};

export const getShortDescription = (description) => {
  return description.length <= MAX_DESCRIPTION ? description : `${description.substring(0, MAX_DESCRIPTION)}...`;
};
