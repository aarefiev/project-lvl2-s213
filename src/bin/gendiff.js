#!/usr/bin/env node
import program from 'commander';
import gendiff from '..';

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const result = gendiff(firstConfig, secondConfig);

    console.log(result);
  })
  .parse(process.argv);
