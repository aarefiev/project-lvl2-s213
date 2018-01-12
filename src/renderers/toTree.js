// @flow

import _ from 'lodash';

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

export default (ast: any, level: number = 0) => `${render(ast, level)}\n`;
