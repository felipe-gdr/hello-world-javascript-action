
const execSync = require('child_process').execSync;

process.on('message', startUpCommand => {
    const output = execSync(startUpCommand);

    console.log(output.toString());
  });
  