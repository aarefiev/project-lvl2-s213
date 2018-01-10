// @flow

import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parser';

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

export const encoding = 'utf8';

export default (pathToFile1: string, pathToFile2: string) => {
  const [pathData1, raw1] = [path
    .parse(pathToFile1), fs.readFileSync(pathToFile1, encoding)];
  const [pathData2, raw2] = [path
    .parse(pathToFile2), fs.readFileSync(pathToFile2, encoding)];

  return renderDiff(parse(pathData1.ext, raw1), parse(pathData2.ext, raw2));
};
