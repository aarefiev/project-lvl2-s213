// @flow

import gendiff from '../src';
import Parser from '../src/parser';

function ParserAdapter(adaptee) {
  return {
    getExtentions: function getExtentions() {
      return Object.keys(adaptee.getData());
    },
  };
}

const preparePath = file => `./__tests__/__fixtures__/${file}`;
const parserAdapter = new ParserAdapter(new Parser());

parserAdapter.getExtentions().forEach((ext) => {
  describe(`diff for ${ext}`, () => {
    const empty = `empty.${ext}`;
    const file1 = `before.${ext}`;
    const file2 = `after.${ext}`;

    it(`${file1} with ${empty}`, () => {
      const answerFile = preparePath(`answer-before-with-empty-${ext}`);
      const parser = new Parser(answerFile);

      expect(gendiff(preparePath(file1), preparePath(empty)))
        .toBe(parser.parse());
    });

    it(`${empty} with ${file1}`, () => {
      const answerFile = preparePath(`answer-empty-with-before-${ext}`);
      const parser = new Parser(answerFile);

      expect(gendiff(preparePath(empty), preparePath(file1)))
        .toBe(parser.parse());
    });

    it(`${file1} with ${file2}`, () => {
      const answerFile = preparePath(`answer-before-with-after-${ext}`);
      const parser = new Parser(answerFile);

      expect(gendiff(preparePath(file1), preparePath(file2)))
        .toBe(parser.parse());
    });

    it(`${file2} with ${file1}`, () => {
      const answerFile = preparePath(`answer-after-with-before-${ext}`);
      const parser = new Parser(answerFile);

      expect(gendiff(preparePath(file2), preparePath(file1)))
        .toBe(parser.parse());
    });
  });
});
