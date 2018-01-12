// @flow

import fs from 'fs';
import gendiff from '../src';

const preparePath = file => `./__tests__/__fixtures__/${file}`;
const fileContentsTypesList = ['simple', 'composite'];
const fileExtensionsList = ['.json', '.yaml', '.ini'];

fileContentsTypesList.forEach((type) => {
  fileExtensionsList.forEach((ext) => {
    describe(`diff for ${ext} files with ${type} content`, () => {
      const empty = `empty-${type}${ext}`;
      const file1 = `before-${type}${ext}`;
      const file2 = `after-${type}${ext}`;

      const emptyPath = preparePath(empty);
      const file1Path = preparePath(file1);
      const file2Path = preparePath(file2);

      it(`${file1} with ${empty}`, () => {
        const expected = fs
          .readFileSync(preparePath(`answer-before-with-empty-${type}`), 'utf-8');

        expect(gendiff(file1Path, emptyPath)).toBe(expected);
      });

      it(`${empty} with ${file1}`, () => {
        const expected = fs
          .readFileSync(preparePath(`answer-empty-with-before-${type}`), 'utf-8');

        expect(gendiff(emptyPath, file1Path)).toBe(expected);
      });

      it(`${file1} with ${file2}`, () => {
        const expected = fs
          .readFileSync(preparePath(`answer-before-with-after-${type}`), 'utf-8');

        expect(gendiff(file1Path, file2Path)).toBe(expected);
      });

      it(`${file2} with ${file1}`, () => {
        const expected = fs
          .readFileSync(preparePath(`answer-after-with-before-${type}`), 'utf-8');

        expect(gendiff(file2Path, file1Path)).toBe(expected);
      });
    });
  });
});
