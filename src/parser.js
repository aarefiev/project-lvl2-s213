// @flow

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const parser: {
  data: any,
  process: any,
} = {
  data: {
    json: JSON.parse,
    yaml: yaml.safeLoad,
    ini: ini.parse,
  },
  process: function process(pathToFile: string) {
    const content = fs.readFileSync(pathToFile, 'utf8');
    const { ext } = path.parse(pathToFile);

    if (ext !== '') {
      return this.data[ext.substr(1, ext.length - 1)](content);
    }

    return content;
  },
};

export default parser;
