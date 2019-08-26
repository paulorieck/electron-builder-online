#!/usr/bin/env node

//const os = require("os");
var parameters = process.argv.slice(2);

/*if ( os.platform() === "win32" ) {

  const {exec} = require('child_process');

  const electron = exec("node "+__dirname+"/electron-builder-online.js");

  electron.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
  });

  electron.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  electron.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

} else if ( os.platform() === "darwin" || os.platform() === "linux" || os.platform() === "win32" ) {*/

  const {spawn} = require('child_process');

  var args = [__dirname+"/electron-builder-online.js"].concat(parameters);

  const options = {
    //cwd: __dirname,
    spawn: false
  }

  const electron = spawn("node", args, options);

  electron.stdout.on('data', (data) => {
      console.log(data.toString('utf8'));
  });

  electron.stderr.on('data', (data) => {
    console.log('stderr: '+data.toString('utf8'));
  });

  electron.on('close', (code) => {
    console.log('child process exited with code '+code);
  });

//}