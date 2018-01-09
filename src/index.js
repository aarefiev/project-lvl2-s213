// @flow

import _ from 'lodash';
import parser from './parser';

const renderDiffForKey = (key, obj1, obj2) => {
  const spaces = (count = 2) => ' '.repeat(count);

  if (_.has(obj1, key) && _.has(obj2, key) && obj1[key] !== obj2[key]) {
    const addedItem = `${spaces()}+ ${key}: ${obj2[key]}\n`;
    const removedItem = `${spaces()}- ${key}: ${obj1[key]}\n`;

    return [addedItem, removedItem];
  } else if (!_.has(obj1, key) && _.has(obj2, key)) {
    return [`${spaces()}+ ${key}: ${obj2[key]}\n`];
  } else if (_.has(obj1, key) && !_.has(obj2, key)) {
    return [`${spaces()}- ${key}: ${obj1[key]}\n`];
  }

  return [`${spaces(4)}${key}: ${obj1[key]}\n`];
};
const renderDiff = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));

  const formattedResult = keys.reduce((acc, key) =>
    [...acc, ...renderDiffForKey(key, obj1, obj2)], []);

  return `{\n${formattedResult.join('')}}\n`;
};

export default (pathToFile1: string, pathToFile2: string) => {
  const obj1 = parser.process(pathToFile1);
  const obj2 = parser.process(pathToFile2);

  return renderDiff(obj1, obj2);
};
