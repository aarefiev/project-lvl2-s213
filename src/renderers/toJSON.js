// @flow

import _ from 'lodash';

const nodeProcessersList = {
  nested: (n, func) => func(n.children),
  unchanged: n => ({ type: n.type, from: n.from }),
  changed: n => ({ type: n.type, from: n.from, to: n.to }),
  deleted: n => ({ type: n.type, from: n.from }),
  added: n => ({ type: n.type, to: n.to }),
};

const render = (ast) => ast.reduce((acc, n) =>
  ({ ...acc, [n.key]: nodeProcessersList[n.type](n, render) }), {});

export default (ast: any) => `${JSON.stringify(render(ast), null, 2)}\n`;
