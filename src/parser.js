// @flow

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

function Parser(pathToFile: ?string) {
  const data = {
    json: JSON.parse,
    yaml: yaml.safeLoad,
    ini: ini.parse,
  };

  return {
    pathToFile,
    getData: function getData() {
      return data;
    },
    parse: function parse(): any {
      const content = fs.readFileSync(this.pathToFile, 'utf8');
      const { ext } = path.parse(this.pathToFile);

      if (ext !== '') {
        return this.getData()[ext.substr(1, ext.length - 1)](content);
      }

      return content;
    },
  };
}

export default Parser;
