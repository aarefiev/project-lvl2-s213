// @flow

import fs from 'fs';
import _ from 'lodash';

const propertyActions = [
  {
    type: 'unchanged',
    check: (key, obj1, obj2) =>
      _.has(obj1, key) && _.has(obj2, key) && obj1[key] === obj2[key],
    process: (obj1, obj2, key) => obj1[key],
  },
  {
    type: 'changed',
    check: (key, obj1, obj2) =>
      _.has(obj1, key) && _.has(obj2, key) && obj1[key] !== obj2[key],
    process: (obj1, obj2, key) => ({ old: obj1[key], new: obj2[key] }),
  },
  {
    type: 'removed',
    check: (key, obj1, obj2) => _.has(obj1, key) && !_.has(obj2, key),
    process: (obj1, obj2, key) => ({ old: obj1[key], new: null }),
  },
  {
    type: 'added',
    check: (key, obj1, obj2) => !_.has(obj1, key) && _.has(obj2, key),
    process: (obj1, obj2, key) => ({ old: null, new: obj2[key] }),
  },
];

const getPropertyAction = (key, obj1, obj2) =>
  _.find(propertyActions, ({ check }) => check(key, obj1, obj2));

const prepareAst = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));

  return keys.map((key) => {
    const { type, process } = getPropertyAction(key, obj1, obj2);
    const value = process(obj1, obj2, key);

    return { type, key, value };
  });
};

const render = (ast) => {
  const spaces = (count = 2) => ' '.repeat(count);
  const formatted = ast.reduce((acc, item) => {
    if (item.type === 'changed') {
      const addedItem = `${spaces()}+ ${item.key}: ${item.value.new}\n`;
      const removedItem = `${spaces()}- ${item.key}: ${item.value.old}\n`;

      return [...acc, addedItem, removedItem];
    } else if (item.type === 'added') {
      return [...acc, `${spaces()}+ ${item.key}: ${item.value.new}\n`];
    } else if (item.type === 'removed') {
      return [...acc, `${spaces()}- ${item.key}: ${item.value.old}\n`];
    }

    return [...acc, `${spaces(4)}${item.key}: ${item.value}\n`];
  }, []);

  return `{\n${formatted.join('')}}\n`;
};

export default (pathToFile1: string, pathToFile2: string) => {
  const obj1 = JSON.parse(fs.readFileSync(pathToFile1, 'utf8'));
  const obj2 = JSON.parse(fs.readFileSync(pathToFile2, 'utf8'));
  const ast = prepareAst(obj1, obj2);

  return render(ast);
};
