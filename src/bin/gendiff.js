#!/usr/bin/env node
import program from 'commander';
import gendiff from '..';
import { version } from '../../package.json';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format, default is \'tree\'')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig, options) => {
    const result = gendiff(firstConfig, secondConfig, options.format);

    console.log(result);
  })
  .parse(process.argv);
