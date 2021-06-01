import {MAX_DESCRIPTION} from '../const.js';

export const getRandomString = (length) => {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
};

export const getShortDescription = (description) => {
  return description.length <= MAX_DESCRIPTION ? description : `${description.substring(0, MAX_DESCRIPTION)}...`;
};
