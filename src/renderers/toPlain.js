// @flow

import _ from 'lodash';

const processValue = (value, prefix = 'value: ') =>
  (_.isObject(value) ? 'complex value' : `${prefix}'${value}'`);
const nodeProcessersList = {
  nested: (n, path, func) => func(n.children, `${path}${n.key}.`),
  changed: (n, path) => {
    const oldValue = processValue(n.from, '');
    const newValue = processValue(n.to, '');

    return `Property '${path}${n.key}' was updated. From ${oldValue} to ${newValue}`;
  },
  deleted: (n, path) => `Property '${path}${n.key}' was removed`,
  added: (n, path) =>
    `Property '${path}${n.key}' was added with ${processValue(n.to)}`,
};

const render = (ast, path = '') => {
  const supporttedNodes = ast.filter(n =>
    Object.keys(nodeProcessersList).includes(n.type));
  const processed = supporttedNodes.map(n =>
    nodeProcessersList[n.type](n, path, render));

  return processed.join('\n');
};

export default (ast: any) => `${render(ast)}\n`;
