import { Buffer } from 'node:buffer';
import axios from 'axios';
import S from 'sanctuary';
const { get, reduce, Just, and, lift2, is, ifElse, I, compose, maybe } = S;
import $ from 'sanctuary-def';
import { fork, encaseP, both } from 'fluture';
import Conf from 'conf';
export const toBase64 = (text) => Buffer.from(unescape(encodeURIComponent(text))).toString('base64');
const concatCredentials = (config) => `${config.get('credentials.user')}:${config.get('credentials.password')}`;
export const getConfig = get(is($.Boolean))('config');
export const getSet = get(is($.Boolean))('set');
export const getAdd = get(is($.Boolean))('add');
export const getCredentials = get(is($.Boolean))('credentials');
export const getUrl = get(is($.Boolean))('url');
export const getPrint = get(is($.Boolean))('print');
export const getIssue = get(is($.Boolean))('issue');
export const getSubtask = get(is($.Boolean))('subtask');
export const getEstimation = get(is($.Boolean))('estimation');
export const getAssignee = get(is($.Boolean))('assignee');
export const getReady = get(is($.Boolean))('ready');
export const getOriginal = get(is($.String))('--original');
export const getRemaining = get(is($.String))('--remaining');
export const getDeveloper = get(is($.String))('<developer>');
export const toBoolean = compose(maybe(false)(I));
export const setCredentials = options =>
  reduce(acc => getter => lift2(and)(acc)(getter(options)))
    (Just(true))
    ([getConfig, getSet, getCredentials]);
export const setUrl = options =>
  reduce(acc => getter => lift2(and)(acc)(getter(options)))
    (Just(true))
    ([getConfig, getUrl]);
export const setEstimation = options =>
  reduce(acc => getter => lift2(and)(acc)(getter(options)))
    (Just(true))
    ([getIssue, getSet, getEstimation]);
export const setAssignation = options =>
  reduce(acc => getter => lift2(and)(acc)(getter(options)))
    (Just(true))
    ([getIssue, getSet, getAssignee]);
export const setReady = options =>
  reduce(acc => getter => lift2(and)(acc)(getter(options)))
    (Just(true))
    ([getIssue, getSet, getReady]);
export const setSubtask = options =>
  reduce(acc => getter => lift2(and)(acc)(getter(options)))
    (Just(true))
    ([getIssue, getAdd, getSubtask]);
export const printConfig = options =>
  reduce(acc => getter => lift2(and)(acc)(getter(options)))
    (Just(true))
    ([getConfig, getPrint]);
export const updateCredentials = (config) => (options) => {
  config.set({
    credentials: {
      user: options['<user>'],
      password: options['<password>'],
    }
  });
};
export const updateUrl = (config) => (options) => {
  config.set({
    url: options['<address>']
  });
};
export const estimationBody = lift2((estimation) => (remainingEstimation) => ({
  'update': {
    'timetracking': [{ 'edit': { ...estimation, ...remainingEstimation } }]
  }
}))
  (compose(maybe({})(estimate => ({ originalEstimate: estimate })))(getOriginal))
  (compose(maybe({})(estimate => ({ remainingEstimate: estimate })))(getRemaining));
export const assigneeBody = compose
  ((developer) => ({
    update: {
      assignee: [{
        set: developer
      }]
    }
  }))
  (
    compose
      (maybe({})(developer => ({ name: developer })))
      (getDeveloper)
  );
export const printConfiguration = (config) => console.log(config.store);

export const addEstimation = (axios) => (config) => (options) =>
  encaseP(axios)({
    method: 'put',
    url: `${config.get('url')}/rest/api/2/issue/${options['<issue>']}`,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${toBase64(concatCredentials(config))}`
    },
    data: estimationBody(options)
  })
    .pipe(fork(({ response }) => console.error(response))(() => console.log(options['<issue>'])));

export const assignTo = (axios) => (config) => (options) =>
  encaseP(axios)({
    method: 'put',
    url: `${config.get('url')}/rest/api/2/issue/${options['<issue>']}`,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${toBase64(concatCredentials(config))}`
    },
    data: assigneeBody(options)
  })
    .pipe(fork(({ response }) => console.error(response))(() => console.log(options['<issue>'])));

export const splitIntoSubtasks = (axios) => (config) => (options) => {
  const credentials = `Basic ${toBase64(concatCredentials(config))}`;
  const fields = {
    project: {
      key: options['<project>']
    },
    parent: {
      key: options['<issue>']
    },
    components: [
      {
        id: options['<component>'] || '27319'
      }
    ],
    issuetype: {
      id: '5'
    },
    description: ''
  };

  const develop = {
    method: 'post',
    url: `${config.get('url')}/rest/api/2/issue`,
    headers: {
      'Accept': 'application/json',
      'Authorization': credentials
    },
    data: { fields: { ...fields, summary: 'Develop' } }
  };
  const validate = {
    method: 'post',
    url: `${config.get('url')}/rest/api/2/issue`,
    headers: {
      'Accept': 'application/json',
      'Authorization': credentials
    },
    data: { fields: { ...fields, summary: 'Validate' } }
  };

  fork(({ response }) => console.error(response))
    ((message) => message.map(({ data: { key } }) => console.log(key)))
    (both
      (encaseP(axios)(develop))
      (encaseP(axios)(validate))
    );
};

export const addSubtask = (axios) => (config) => (options) => {
  const credentials = `Basic ${toBase64(concatCredentials(config))}`;
  const fields = {
    project: {
      key: options['<project>']
    },
    parent: {
      key: options['<issue>']
    },
    components: [
      {
        id: options['<component>'] || '27319'
      }
    ],
    issuetype: {
      id: '5'
    },
    description: '',
    summary: options['<subtask>']
  };


    encaseP(axios)({
      method: 'post',
      url: `${config.get('url')}/rest/api/2/issue`,
      headers: {
        'Accept': 'application/json',
        'Authorization': credentials
      },
      data: { fields }
    })
      .pipe(fork(({ response }) => console.error(response))(({ data }) => console.log(data.key)));
}

export const doc = `""Jira Cli.

Usage:
  jira-cli config set credentials <user> <password>
  jira-cli config set url <address>
  jira-cli config print
  jira-cli issue set estimation <issue> --original=<original_estimation> [--remaining=<remaining_estimation>]
  jira-cli issue set assignee <issue> <developer>
  jira-cli issue set ready <issue> <project> [<component>]
  jira-cli issue add subtask <issue> <project> <subtask> [<component>]
  jira-cli -h | --help
  jira-cli -v | --version

Options:
  -h --help     Show this screen.
  -v --version     Show version.

""`;


const config = new Conf({
  configName: 'cli-jira',
  projectName: 'cli-jira'
});

export default (options) => {
  ifElse(toBoolean(printConfig))(() => printConfiguration(config))(I)(options);
  ifElse(toBoolean(setCredentials))(updateCredentials(config))(I)(options);
  ifElse(toBoolean(setUrl))(updateUrl(config))(I)(options);
  ifElse(toBoolean(setEstimation))(addEstimation(axios)(config))(I)(options);
  ifElse(toBoolean(setAssignation))(assignTo(axios)(config))(I)(options);
  ifElse(toBoolean(setReady))(splitIntoSubtasks(axios)(config))(I)(options);
  ifElse(toBoolean(setSubtask))(addSubtask(axios)(config))(I)(options);
}