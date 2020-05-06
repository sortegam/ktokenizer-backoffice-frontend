const fs = require('fs');
const replace = require('replace-in-file');

const getAvailableStages = () =>
  fs
    .readdirSync('.')
    .filter(file => /^\.env\..*\.local/i.test(file)) // Get the .env-* files
    .map(file => file.replace(/\.env\.(.*)\..*/, (match, p1) => p1)); // Remove env- to get only the env tag

/**
 * It tries to replace or add new setting to an ENV file
 */
const setVarInEnvFile = (envFile, key, value) => {
  const replaceOptions = {
    files: envFile,
    from: new RegExp(`^${key}.*`, 'g'),
    to: `${key}=${value}`,
  };
  const result = replace.sync(replaceOptions);
  // That means that no replacing ocurred.
  if (result.length === 0) {
    fs.appendFileSync(envFile, `${key}=${value}\n`);
  }
};

const getDefaultEnvVars = () =>
  fs
    .readFileSync('.env.default')
    .toString('utf-8')
    .split('\n')
    .reduce(function(envVars, envVar) {
      if (envVar) {
        envVars.push(envVar.replace('=', ''));
      }
      return envVars;
    }, []);

module.exports = {
  getAvailableStages,
  setVarInEnvFile,
  getDefaultEnvVars,
};
