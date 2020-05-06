const inquirer = require('inquirer');
const colors = require('colors');
const utils = require('../utils');
const fs = require('fs');

const availableStages = utils.getAvailableStages();

const availableEnvVars = utils.getDefaultEnvVars();

const QUESTIONS = {
  newStage: {
    type: 'text',
    name: 'New Stage Name',
  },
};

const ENV_VARS_QUESTIONS = [];

// Generate questions for each variable.
availableEnvVars.forEach(envVar => {
  ENV_VARS_QUESTIONS.push({
    type: 'text',
    name: envVar,
  });
});

console.log('------------------------------------------------------------------------------------');
console.log('  Creating STAGE from scratch...');
console.log('------------------------------------------------------------------------------------');
console.log('');

const run = async () => {
  let newStage;
  do {
    const newStageAnswer = await inquirer.prompt([QUESTIONS.newStage]);
    newStage = newStageAnswer[QUESTIONS.newStage.name];
    if (availableStages.includes(newStage)) {
      console.log(`The STAGE ${newStage} already exists, please choose another STAGE name...`.red);
    }
  } while (availableStages.includes(newStage));
  // Create the stage
  const envVarAnswers = await inquirer.prompt(ENV_VARS_QUESTIONS);
  console.log(`Creating STAGE ${newStage} from scratch...`.yellow);
  availableEnvVars.forEach(envVar => {
    utils.setVarInEnvFile(`.env.${newStage}.local`, envVar, envVarAnswers[envVar]);
  });
  console.log(`STAGE ${newStage} has been created!`.green);
};

run();
