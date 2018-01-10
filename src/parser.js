// @flow

import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.ini': ini.parse,
};

export default (ext: string, content: string) => parsers[ext](content);
