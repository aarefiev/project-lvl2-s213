# Gendiff
Project for level 2 on Hexlet.io.

A CLI application that allows to compare two configuration files and show a difference. It supports files in JSON, Yaml, Ini formats and may show difference in JSON, Plain and Tree formats.

[![Build Status](https://travis-ci.org/aarefiev/project-lvl2-s213.svg?branch=master)](https://travis-ci.org/aarefiev/project-lvl2-s213)
[![Maintainability](https://api.codeclimate.com/v1/badges/2a49a056f807dd771c8d/maintainability)](https://codeclimate.com/github/aarefiev/project-lvl2-s213/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2a49a056f807dd771c8d/test_coverage)](https://codeclimate.com/github/aarefiev/project-lvl2-s213/test_coverage)

## Setup

```bash
$ make install
```

## Usage

```bash
$ gendiff [options] <firstConfig> <secondConfig>

Options:

  -h, --help           output usage information
  -V, --version        output the version number
  -f, --format [type]  Output format
```
