require('colors');

var parameters = process.argv.slice(2);
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const os = require('os');

var confs = {};
if ( fs.existsSync(path.join(os.homedir(), '.electron-builder-online', 'configs.json')) ) {

    confs = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.electron-builder-online', 'configs.json')));

    if ( typeof confs.server_address === "undefined" ) {
        confs.server_address = "187.85.174.221:8080";
    }

} else {

    confs = {"server_address": "187.85.174.221:8080"};

}
fs.writeFileSync(path.join(os.homedir(), '.electron-builder-online', 'configs.json'), JSON.stringify(confs));

var welcome_logo = 
'\n\n[-----------------------------------------------------------------------------------------------------------------------------]\n'+
'[                                                                                                                             ]\n'+
'[    .oPYo. 8                 o                      .oPYo.         o 8      8              .oPYo.       8  o                 ]\n'+
'[    8.     8                 8                      8   `8           8      8              8    8       8                    ]\n'+
'[    `boo   8 .oPYo. .oPYo.  o8P oPYo. .oPYo. odYo. o8YooP\' o    o o8 8 .oPYo8 .oPYo. oPYo. 8    8 odYo. 8 o8 odYo. .oPYo.    ]\n'+
'[    .P     8 8oooo8 8    \'   8  8  \`\' 8    8 8\' \`8  8   \`b 8    8  8 8 8    8 8oooo8 8  \`\' 8    8 8\' \`8 8  8 8\' \`8 8oooo8    ]\n'+
'[    8      8 8.     8    .   8  8     8    8 8   8  8    8 8    8  8 8 8    8 8.     8     8    8 8   8 8  8 8   8 8.        ]\n'+
'[    \`YooP\' 8 \`Yooo\' \`YooP\'   8  8     \`YooP\' 8   8  8oooP\' \`YooP\'  8 8 \`YooP\' \`Yooo\' 8     \`YooP\' 8   8 8  8 8   8 \`Yooo\'    ]\n'+
'[    :.....:..:.....::.....:::..:..:::::.....:..::..:......::.....::....:.....::.....:..:::::.....:..::....:....::..:.....:   ]\n'+
'[    ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::   ]\n'+
'[    ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::   ]\n'+
'[                                                                                                                             ]\n'+
'[-----------------------------------------------------------------------------------------------------------------------------]'

console.log(welcome_logo.yellow);
console.log("Copyright @ Paulo André Rieck\n\n".red);
console.log("If you want to improve the processing time please, consider a donation!\n\n");

var subscription = "";

function main() {

    // Subscribe to websocket
    var ws = new WebSocket('ws://'+confs.server_address+'/');

    var package = JSON.parse(fs.readFileSync("package.json"));

    if ( package.repository.type === "git" && typeof package.repository.url !== "undefined" && package.repository.url !== null && package.repository.url !== "" ) {

        ws.on('open', function open() {
            console.log('WebSocket connection opened.');
            parameters = parameters.concat(["--repository="+package.repository.url]);
            ws.send(JSON.stringify({'op': 'subscribe', 'parameters': parameters}));
        });
        
        ws.on('message', function incoming(data) {
    
            data = JSON.parse(data);
    
            if ( data.op === 'returned_subscribe' ) {
    
                subscription = data.subscription;
                ws.send(JSON.stringify({'op': 'getQueueSize'}));
    
            } else if ( data.op === 'returned_getQueueSize' ) {
    
                console.log("Your job is in queue, there are '"+data.size+"' jobs in front of yours.");
    
            } else if ( data.op === 'console_output' ) {
    
                console.log(data.message);

                if ( typeof data.message !== "undefined" && data.message.indexOf("Congratulations! Your job has completed!") !== -1 ) {
                    ws.close();
                }
    
            }
    
        });

    } else {

        console.log("Attention! The repository must be on GitHub and the correct URL must be provided!");

    }

}
main();

module.exports = {

    build: function (parameters_) {

        parameters = parameters_;
        main();

    }

}