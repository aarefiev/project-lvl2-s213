// @flow

import toTree from './toTree';
import toPlain from './toPlain';

const renderers = {
  tree: toTree,
  plain: toPlain,
};

export default (content: string, format: string = 'tree') =>
  renderers[format](content);
