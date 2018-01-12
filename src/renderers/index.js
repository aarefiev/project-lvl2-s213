// @flow

import toJSON from './toJSON';
import toTree from './toTree';
import toPlain from './toPlain';

const renderers = {
  json: toJSON,
  tree: toTree,
  plain: toPlain,
};

export default (content: string, format: string = 'tree') =>
  renderers[format](content);
