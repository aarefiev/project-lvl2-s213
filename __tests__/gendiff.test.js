// @flow

import fs from 'fs';
import gendiff, { encoding } from '../src';

const preparePath = file => `./__tests__/__fixtures__/${file}`;
const fileExtensionsList = ['.json', '.yaml', '.ini'];

fileExtensionsList.forEach((ext) => {
  describe(`diff for ${ext}`, () => {
    const empty = `empty${ext}`;
    const file1 = `before${ext}`;
    const file2 = `after${ext}`;

    const emptyPath = preparePath(empty);
    const file1Path = preparePath(file1);
    const file2Path = preparePath(file2);

    it(`${file1} with ${empty}`, () => {
      const expected = fs
        .readFileSync(preparePath('answer-before-with-empty'), encoding);

      expect(gendiff(file1Path, emptyPath)).toBe(expected);
    });

    it(`${empty} with ${file1}`, () => {
      const expected = fs
        .readFileSync(preparePath('answer-empty-with-before'), encoding);

      expect(gendiff(emptyPath, file1Path)).toBe(expected);
    });

    it(`${file1} with ${file2}`, () => {
      const expected = fs
        .readFileSync(preparePath('answer-before-with-after'), encoding);

      expect(gendiff(file1Path, file2Path)).toBe(expected);
    });

    it(`${file2} with ${file1}`, () => {
      const expected = fs
        .readFileSync(preparePath('answer-after-with-before'), encoding);

      expect(gendiff(file2Path, file1Path)).toBe(expected);
    });
  });
});
