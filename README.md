# jira-cli

The aim of this tool is performing some actions which are common to my daily work with Jira in a smother way, it's not my purpose to handle Jira form this tool neither to have actions I don't use in my developing workflow -there're better tools for that, for example [ankitpokhrel/jira-cli](https://github.com/ankitpokhrel/jira-cli)-

I've created this tool mostly to speed up the Jira's workflow when I have the Scrum master rol, the scrum master needs to assignee created actions to developer or split tickets into Developing and Validation subtasks so the team can estimate both actions; I've check I'm more productive working from the terminal rather than performing those actions through Jira.

Even though, Jira is a powerful tool which I still learning to manage and 100% of the actions you can perform from this tool can be done through Jira.

⚠️ This tool saves your Jira password in plain text also when the configuration is printed, the password is visible

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

```sh
jira-cli
Usage:
  jira-cli config set credentials <user> <password>
  jira-cli config set url <address>
  jira-cli config print
  jira-cli issue set estimation <issue> --original=<original_estimation> [--remaining=<remaining_estimation>]
  jira-cli issue set assignee <issue> <developer>
  jira-cli -h | --help
  jira-cli -v | --version
```

## Install

To install the tool execute the next command

> npm i -g @Paker30/jira-cli

And check the version of the tool

> jira-cli -v

## Actions

In order to list all the actions you can execute with this tool, execute the next command in your terminal

> jira-cli

And a list with all the actions shows up

### Parameters

- issue: It's the issue's identifier
- developer: User's Jira name
- estimation: Issue's estimation, it can be added in any Jira supported format
- user: Your Jira user name -you can see it at Jira's profile-
- password: Your password Jira access
