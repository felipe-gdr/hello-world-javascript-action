// const core = require('@actions/core');
// const github = require('@actions/github');
const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const fork = require('child_process').fork;

const configFilePath = path.join('.graphql-analyzer.json');

const configContent = fs.readFileSync(configFilePath, 'utf8');

const config = JSON.parse(configContent);

const executeFile = schema => {
  const schemaFilePath = path.join(schema.path);

  console.log(`analyzing schema file: ${schemaFilePath}`);

  const schemaContent = fs.readFileSync(schemaFilePath, 'utf-8');

  console.log(`schema content from file: ${schemaContent}`);
  console.log('TODO: Implement schema analyzis');
}

const fetchSchemaFromServer = url => {
  const cmd = `get-graphql-schema ${url}`;

  return new Promise((resolve, err) => {
    setTimeout(() => {
      try {
        const schemaContent = execSync(cmd);

        console.log(`schema content from server: ${schemaContent}`);

        resolve()

      } catch (err) {
        reject(err)
      }
    }, 3000);
  });
}

const executeServer = async schema => {
  console.log(`starting graphql server: ${schema.graphqlEndpoint}`);

  // "beforeStartUp" can be an array of commands, or a single string command
  const commands = [schema.beforeStartUp].flatMap(maybeList => maybeList)

  commands
    .map(command => {
      try {
        console.log(`running ${command}`)
        return execSync(command);
      } catch (err) {
        console.log(err);
      }
    })
    .map(out => out.toString())
    .map(console.log);

  const forked = fork(`${__dirname}/fork.js`);

  forked.send(schema.startUpCommand);

  await fetchSchemaFromServer(schema.graphqlEndpoint);

  forked.kill('SIGINT');
}

config.schemas.forEach(schema => {
  switch (schema.type) {
    case 'file': {
      executeFile(schema);
      break;
    }
    case 'server': {
      executeServer(schema);
      break;
    }
    default: {
      throw new Error(`Invalid schema type: ${schema.type}`)
    }
  }
})
