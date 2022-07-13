#!/usr/bin/env node

import * as Docopt from 'docopt';
import Conf from 'conf';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { version } = require('../package.json');
const { docopt } = Docopt;

const doc = `""Jira Cli.

Usage:
  jira-cli config set credentials <user> <password>
  jira-cli config set url <address>
  jira-cli config print
  jira-cli -h | --help
  jira-cli -v | --version

Options:
  -h --help     Show this screen.
  -v --version     Show version.

""`;

const config = new Conf({
  configName: 'jira-cli'
});

const main = (options) => {
  if(options.config){
    if(options.set){
      if(options.credentials){
        config.set({
          credentials: {
            user: options['<user>'],
            password: options['<password>'],
          }
        });
        return 1;
      }
      if(options.url){
        config.set({
          url: options['<address>']
        });
        return 1;
      }
    }
    if(options.print){
      console.log(config.store);
      return 1;
    }
  }
};

main(docopt(doc, { version }));
