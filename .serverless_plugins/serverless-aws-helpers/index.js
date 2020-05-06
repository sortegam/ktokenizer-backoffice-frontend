'use strict';
const beforeDeployCore = require('./deploy/beforeDeploy');

class ServerlessAWSHelpers {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.commands = {
      awshelpers: {
        usage: 'Helps you start your first Serverless plugin',
        lifecycleEvents: ['hello', 'world'],
        options: {
          message: {
            usage:
              'Specify the message you want to deploy ' +
              '(e.g. "--message \'My Message\'" or "-m \'My Message\'")',
            required: true,
          },
        },
        commands: {
          stages: {
            usage: 'Helps you start your first Serverless plugin',
            lifecycleEvents: ['hello', 'world'],
            options: {
              message: {
                usage:
                  'Specify the message you want to deploy ' +
                  '(e.g. "--message \'My Message\'" or "-m \'My Message\'")',
                required: true,
              },
            },
          },
        },
      },
    };

    this.hooks = {
      'before:deploy:initialize': this.beforeDeploy.bind(this),
    };
  }

  async beforeDeploy() {
    this.serverless.cli.log('Executing AWS Helper');
    await beforeDeployCore();
  }
}

module.exports = ServerlessAWSHelpers;
