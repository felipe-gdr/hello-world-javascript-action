module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(104);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 104:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

// const core = require('@actions/core');
// const github = require('@actions/github');
const path = __webpack_require__(622);
const fs = __webpack_require__(747);
const execSync = __webpack_require__(129).execSync;
const fork = __webpack_require__(129).fork;

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

  const forked = fork(__webpack_require__.ab + "fork.js");

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


/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ })

/******/ });