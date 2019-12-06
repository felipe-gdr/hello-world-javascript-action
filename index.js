const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');

console.log('This is a GraphQL Analyzis action');

core.log('starting graphql-analyzis action');

const configFilePath = path.join('.graphql-analyzer.json');

core.log(`config file path: ${configFilePath}`);

const configContent = fs.readFileSync(configFilePath, 'utf8');

core.log(`config content: ${configContent}`);

const config = JSON.parse(configContent);

const schemaFilePath = path.join(config.schemaFile)

core.log(`schema file path: ${schemaFilePath}`);

const schema = fs.readFileSync(schemaFilePath, 'utf-8');

core.log(`schema contents: ${schema}`)

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello::: ${nameToGreet}!`);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}