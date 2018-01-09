// @flow

import fs from 'fs';
import _ from 'lodash';

const renderDiff = (obj1, obj2) => {
  const spaces = (count = 2) => ' '.repeat(count);
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));

  const formattedResult = keys.reduce((acc, key) => {
    if (_.has(obj1, key) && _.has(obj2, key) && obj1[key] !== obj2[key]) {
      const addedItem = `${spaces()}+ ${key}: ${obj2[key]}\n`;
      const removedItem = `${spaces()}- ${key}: ${obj1[key]}\n`;

      return [...acc, addedItem, removedItem];
    } else if (!_.has(obj1, key) && _.has(obj2, key)) {
      return [...acc, `${spaces()}+ ${key}: ${obj2[key]}\n`];
    } else if (_.has(obj1, key) && !_.has(obj2, key)) {
      return [...acc, `${spaces()}- ${key}: ${obj1[key]}\n`];
    }

    return [...acc, `${spaces(4)}${key}: ${obj1[key]}\n`];
  }, []);

  return `{\n${formattedResult.join('')}}\n`;
};

export default (pathToFile1: string, pathToFile2: string) => {
  const obj1 = JSON.parse(fs.readFileSync(pathToFile1, 'utf8'));
  const obj2 = JSON.parse(fs.readFileSync(pathToFile2, 'utf8'));

  return renderDiff(obj1, obj2);
};
