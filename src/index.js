// @flow

import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parser';
import render from './renderers';

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
    process: (key, obj1, obj2, func) =>
      ({ children: func(obj1[key], obj2[key]) }),
  },
  {
    type: 'unchanged',
    check: (key, obj1, obj2) =>
      _.has(obj1, key) && _.has(obj2, key) && obj1[key] === obj2[key],
    process: (key, obj1) => ({ from: obj1[key] }),
  },
  {
    type: 'changed',
    check: (key, obj1, obj2) =>
      _.has(obj1, key) && _.has(obj2, key) && obj1[key] !== obj2[key],
    process: (key, obj1, obj2) => ({ from: obj1[key], to: obj2[key] }),
  },
  {
    type: 'deleted',
    check: (key, obj1, obj2) => _.has(obj1, key) && !_.has(obj2, key),
    process: (key, obj1) => ({ from: obj1[key] }),
  },
  {
    type: 'added',
    check: (key, obj1, obj2) => !_.has(obj1, key) && _.has(obj2, key),
    process: (key, obj1, obj2) => ({ to: obj2[key] }),
  },
];

const prepareAst = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2));

  return keys.map((key) => {
    const { type, process } = _.find(propertyTypes, ({ check }) =>
      check(key, obj1, obj2));
    const { from, to, children } = process(key, obj1, obj2, prepareAst);

    return {
      type, key, from, to, children,
    };
  });
};

export default (pathToFile1: string, pathToFile2: string, format: string = 'tree') => {
  const obj1 = parseFileToObject(pathToFile1);
  const obj2 = parseFileToObject(pathToFile2);
  const ast = prepareAst(obj1, obj2);

  return render(ast, format);
};
