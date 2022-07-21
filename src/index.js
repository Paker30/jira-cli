#!/usr/bin/env node

import axios from 'axios';
import * as Docopt from 'docopt';
import S from 'sanctuary';
const { get, reduce, Just, and, lift2, is, show, ifElse, I, compose, maybe } = S;
import $ from 'sanctuary-def';
import Conf from 'conf';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { version } = require('../package.json');
const { docopt } = Docopt;
const getConfig = get(is($.Boolean))('config');
const getSet = get(is($.Boolean))('set');
const getCredentials = get(is($.Boolean))('credentials');
const getUrl = get(is($.Boolean))('url');
const getPrint = get(is($.Boolean))('print');
const toBoolean = compose(maybe(false)(I));

const toBase64 = (text) => globalThis.btoa(unescape(encodeURIComponent(text)));
const setCredentials = options =>
  reduce(acc => getter => lift2(and)(acc)(getter(options)))
    (Just(true))
    ([getConfig, getSet, getCredentials]);
const setUrl = options =>
  reduce(acc => getter => lift2(and)(acc)(getter(options)))
    (Just(true))
    ([getConfig, getUrl]);
const printConfig = options =>
  reduce(acc => getter => lift2(and)(acc)(getter(options)))
    (Just(true))
    ([getConfig, getPrint]);
const updateCredentials = (config) => (options) => {
  config.set({
    credentials: {
      user: options['<user>'],
      password: options['<password>'],
    }
  });
};
const updateUrl = (config) => (options) => {
  config.set({
    url: options['<address>']
  });
};
const printConfiguration = (config) => console.log(config.store);

const doc = `""Jira Cli.

Usage:
  jira-cli config set credentials <user> <password>
  jira-cli config set url <address>
  jira-cli config print
  jira-cli issue set estimation <issue> --original=<original_estimation> [--remaining=<remaining_estimation>]
  jira-cli issue set assignee <issue> <developer>
  jira-cli -h | --help
  jira-cli -v | --version

Options:
  -h --help     Show this screen.
  -v --version     Show version.

""`;

const config = new Conf({
  configName: 'cli-jira'
});

const main = (options) => {
  ifElse(toBoolean(printConfig))(() => printConfiguration(config))(I)(options);
  ifElse(toBoolean(setCredentials))(updateCredentials(config))(I)(options);
  ifElse(toBoolean(setUrl))(updateUrl(config))(I)(options);

  if (options.issue) {
    if (options.set) {
      if (options.estimation) {
        const credentials = `${config.get('credentials.user')}:${config.get('credentials.password')}`;
        const estimation = {
          originalEstimate: options['--original']
        };
        if (options['--remaining']) {
          estimation.remainingEstimate = options['--remaining'];
        }
        const body = {
          'update': {
            'timetracking': [{ 'edit': { ...estimation } }]
          }
        };

        return axios({
          method: 'put',
          url: `${config.get('url')}/rest/api/2/issue/${options['<issue>']}`,
          headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${toBase64(credentials)}`
          },
          data: body
        })
          .then(({ data }) => {
            console.log(data)
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (options.assignee) {
        const credentials = `${config.get('credentials.user')}:${config.get('credentials.password')}`;
        return axios({
          method: 'put',
          url: `${config.get('url')}/rest/api/2/issue/${options['<issue>']}`,
          headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${toBase64(credentials)}`
          },
          data: {
            update: {
              assignee: [{
                set: { name: `${options['<developer>']}` }
              }]
            }
          }
        })
          .then(({ data }) => console.log(data))
          .catch(console.error)
      }

      if (options.slpit) {
        const credentials = `${config.get('credentials.user')}:${config.get('credentials.password')}`;
        const bodyDevelop = {
          fields: {
            project: {
              key: options['<project>']
            },
            parent: {
              key: options['<issue>']
            },
            summary: "Develop",
            issuetype: {
              id: '5'
            }
          }
        };
        const bodyValidate = {
          fields: {
            project: {
              key: options['<project>']
            },
            parent: {
              key: options['<issue>']
            },
            summary: "Validation",
            issuetype: {
              id: '5'
            }
          }
        };
        const develop = axios({
          method: 'post',
          url: `${config.get('url')}/rest/api/2/issue`,
          headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${toBase64(credentials)}`
          },
          data: bodyDevelop
        });
        const validate = axios({
          method: 'post',
          url: `${config.get('url')}/rest/api/2/issue`,
          headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${toBase64(credentials)}`
          },
          data: bodyValidate
        });

        return Promise.all([develop, validate])
          .then(({ data }) => console.log(data))
          .catch(console.error)
      }
    }
  }
}

main(docopt(doc, { version }));
