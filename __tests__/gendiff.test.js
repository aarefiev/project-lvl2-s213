// @flow

import fs from 'fs';
import gendiff from '../src';

const encoding = 'utf8';
const preparePath = file => `./__tests__/__fixtures__/${file}`;

describe('diff', () => {
  const empty = 'empty.json';
  const file1 = 'before.json';
  const file2 = 'after.json';
  const answer1 = 'answer-1-with-empty';
  const answer2 = 'answer-empty-with-1';
  const answer3 = 'answer-1-with-2';
  const answer4 = 'answer-2-with-1';

  it(`${file1} with ${empty}`, () => {
    const expected = fs.readFileSync(preparePath(answer1), encoding);

    expect(gendiff(preparePath(file1), preparePath(empty))).toBe(expected);
  });

  it(`${empty} with ${file1}`, () => {
    const expected = fs.readFileSync(preparePath(answer2), encoding);

    expect(gendiff(preparePath(empty), preparePath(file1))).toBe(expected);
  });

  it(`${file1} with ${file2}`, () => {
    const expected = fs.readFileSync(preparePath(answer3), encoding);

    expect(gendiff(preparePath(file1), preparePath(file2))).toBe(expected);
  });

  it(`${file2} with ${file1}`, () => {
    const expected = fs.readFileSync(preparePath(answer4), encoding);

    expect(gendiff(preparePath(file2), preparePath(file1))).toBe(expected);
  });
});
