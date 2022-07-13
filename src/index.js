#!/usr/bin/env node

import * as Docopt from 'docopt';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { version } = require('../package.json');
const { docopt } = Docopt;

const doc = `""Jira Cli.

Usage:
  jira-cli ship new <name>
  jira-cli -h | --help
  jira-cli -v | --version

Options:
  -h --help     Show this screen.
  -v --version     Show version.

""`;

docopt(doc, { version });
