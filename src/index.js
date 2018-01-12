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

const addSpaces = (count = 4) => ' '.repeat(count);
const processNodeWithObjectValue = (key, value, prefix, level) => {
  const prefixSpaces = `${addSpaces(4 * level)}  `;

  const processed = _.flatten(Object.keys(value).map((iterKey) => {
    const iterPrefix = `${addSpaces()}  `;

    if (_.isObject(value[iterKey])) {
      return processNodeWithObjectValue(iterKey, value[iterKey], '  ', level + 1);
    }

    return `${prefixSpaces}${iterPrefix}${iterKey}: ${value[iterKey]}`;
  }));

  return [`${prefixSpaces}${prefix}${key}: {`, ...processed, `${prefixSpaces}  }`];
};
const processNode = (key, value, prefix, level) => {
  const prefixSpaces = `${addSpaces(4 * level)}  `;

  if (_.isObject(value)) {
    return processNodeWithObjectValue(key, value, prefix, level);
  }

  return [`${prefixSpaces}${prefix}${key}: ${value}`];
};

const nodeProcessersList = {
  nested: (n, level, func) => {
    const prefix = `${addSpaces(4 * level)}${addSpaces()}`;
    const renderedChilds = func(n.children, level + 1);

    return `${prefix}${n.key}: ${renderedChilds}`;
  },
  unchanged: (n, level) => processNode(n.key, n.from, '  ', level),
  changed: (n, level) => {
    const addedNode = processNode(n.key, n.to, '+ ', level);
    const deletedNode = processNode(n.key, n.from, '- ', level);

    return [addedNode, deletedNode];
  },
  deleted: (n, level) => processNode(n.key, n.from, '- ', level),
  added: (n, level) => processNode(n.key, n.to, '+ ', level),
};

const render = (ast, level = 0) => {
  const processed = _.flatten(ast.map(n =>
    nodeProcessersList[n.type](n, level, render)));

  return ['{', ...processed, `${addSpaces(4 * level)}}`].join('\n');
};

export default (pathToFile1: string, pathToFile2: string) => {
  const obj1 = parseFileToObject(pathToFile1);
  const obj2 = parseFileToObject(pathToFile2);
  const ast = prepareAst(obj1, obj2);

  return `${render(ast)}\n`;
};
