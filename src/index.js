// @flow

import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parser';

const encoding = 'utf8';
const parseFileToObject = (pathToFile) => {
  const { ext } = path.parse(pathToFile);
  const content = fs.readFileSync(pathToFile, encoding);

  return parse(ext, content);
};

const propertyTypes = [
  {
    type: 'nested',
    check: (key, obj1, obj2) => _.isObject(obj1[key]) && _.isObject(obj2[key]),
    process: (key, obj1, obj2, func) => func(obj1[key], obj2[key]),
  },
  {
    type: 'unchanged',
    check: (key, obj1, obj2) =>
      _.has(obj1, key) && _.has(obj2, key) && obj1[key] === obj2[key],
    process: (key, obj1) => obj1[key],
  },
  {
    type: 'changed',
    check: (key, obj1, obj2) =>
      _.has(obj1, key) && _.has(obj2, key) && obj1[key] !== obj2[key],
    process: (key, obj1, obj2) => ({ old: obj1[key], new: obj2[key] }),
  },
  {
    type: 'deleted',
    check: (key, obj1, obj2) => _.has(obj1, key) && !_.has(obj2, key),
    process: (key, obj1) => obj1[key],
  },
  {
    type: 'added',
    check: (key, obj1, obj2) => !_.has(obj1, key) && _.has(obj2, key),
    process: (key, obj1, obj2) => obj2[key],
  },
];

const getPropertyAction = (key, obj1, obj2) =>
  _.find(propertyTypes, ({ check }) => check(key, obj1, obj2));

const prepareAst = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2));

  return keys.map((key) => {
    const { type, process } = getPropertyAction(key, obj1, obj2);
    const value = process(key, obj1, obj2, prepareAst);

    if (_.isObject(value)) {
      return { type, key, children: value };
    }

    return { type, key, value };
  });
};

const render = (ast) => {
  const eol = '\n';
  const spaces = (count = 2) => ' '.repeat(count);
  const processValue = (value, level) => {
    const addSpaces = level * 4;

    if (!_.isObject(value)) {
      return value;
    }

    const result = Object.keys(value).reduce((acc, key) => {
      let processed;

      if (_.isObject(value[key])) {
        processed = processValue(value[key], level + 1);
      }

      return `${acc}${spaces(4 + addSpaces)}${key}: ${processed || value[key]}${eol}`;
    }, '');

    return `{${eol}${result}${spaces(addSpaces)}}`;
  };

  const iter = (tree, level = 0) => {
    const addSpaces = level * 4;

    const nodeToString = (node) => {
      const { type, key, value } = node;
      const { children } = node;
      const item = children || value;

      if (type === 'nested') {
        return `${spaces(4 + addSpaces)}${key}: ${iter(children, level + 1)}`;
      } if (type === 'changed') {
        const added = `${spaces(2 + addSpaces)}+ ${key}: ${children.new}`;
        const removed = `${spaces(2 + addSpaces)}- ${key}: ${children.old}`;

        return `${added}${eol}${removed}`;
      } else if (type === 'deleted') {
        return `${spaces(2 + addSpaces)}- ${key}: ${processValue(item, level + 1)}`;
      } else if (type === 'added') {
        return `${spaces(2 + addSpaces)}+ ${key}: ${processValue(item, level + 1)}`;
      }

      return `${spaces(4 + addSpaces)}${key}: ${processValue(item, level + 1)}`;
    };

    const result = tree.reduce((acc, node) =>
      `${acc}${nodeToString(node)}${eol}`, '');

    return `{${eol}${result}${spaces(addSpaces)}}`;
  };

  return `${iter(ast)}${eol}`;
};

export { encoding };
export default (pathToFile1: string, pathToFile2: string) => {
  const obj1 = parseFileToObject(pathToFile1);
  const obj2 = parseFileToObject(pathToFile2);
  const ast = prepareAst(obj1, obj2);

  return render(ast);
};
