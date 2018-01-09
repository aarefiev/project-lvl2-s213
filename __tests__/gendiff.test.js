// @flow

import gendiff from '../src';
import parser from '../src/parser';

const preparePath = file => `./__tests__/__fixtures__/${file}`;

Object.keys(parser.data).forEach((ext) => {
  describe(`diff for ${ext}`, () => {
    const empty = `empty.${ext}`;
    const file1 = `before.${ext}`;
    const file2 = `after.${ext}`;

    it(`${file1} with ${empty}`, () => {
      const answerFile = preparePath(`answer-before-with-empty-${ext}`);
      const expected = parser.process(answerFile);

      expect(gendiff(preparePath(file1), preparePath(empty))).toBe(expected);
    });

    it(`${empty} with ${file1}`, () => {
      const answerFile = preparePath(`answer-empty-with-before-${ext}`);
      const expected = parser.process(answerFile);

      expect(gendiff(preparePath(empty), preparePath(file1))).toBe(expected);
    });

    it(`${file1} with ${file2}`, () => {
      const answerFile = preparePath(`answer-before-with-after-${ext}`);
      const expected = parser.process(answerFile);

      expect(gendiff(preparePath(file1), preparePath(file2))).toBe(expected);
    });

    it(`${file2} with ${file1}`, () => {
      const answerFile = preparePath(`answer-after-with-before-${ext}`);
      const expected = parser.process(answerFile);

      expect(gendiff(preparePath(file2), preparePath(file1))).toBe(expected);
    });
  });
});
