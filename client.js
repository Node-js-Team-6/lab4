const net = require('net');
const readline = require('readline');

const { Folder } = require('./classes.js');
const { File } = require('./classes.js');
const { Rating } = require("./classes.js");
const { User } = require("./classes.js");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new net.Socket();

client.connect(20202, '127.0.0.1', function() {
	console.log(`Connected to server`);
    const msg = {cmd: "getRoot"};
	client.write(JSON.stringify(msg));
});

client.on('data', function(dataIn) {
	
	const data = JSON.parse(dataIn);

    if(data.cmd === "getRating") {
        showFile(data.result, res => {
            if(res === 'd' || res === 'D') {
                const msg = {cmd: "deleteFile", param: data.result};
                client.write(JSON.stringify(msg));
    
                msg = {cmd: "getRoot"};
                client.write(JSON.stringify(msg));
            } else if (res === 'a' || res === 'A') {
                const msg = {cmd: "getRoot"};
                client.write(JSON.stringify(msg));
            }
        });
    }

    if(data.cmd === "getRoot" || data.cmd === 'getChilder' || data.cmd === 'sortByRating' || 
       data.cmd === 'sortByAuthor' || data.cmd === 'sortByName' || data.cmd === 'sortByDownloadCount') {

        console.log('Data:  ', data);

        showFolder(data.result, res => {
            if(res === 'r' || res === 'R') {
                const msg = {cmd: 'sortByRating', param: new Folder({children: data.result})};
                client.write(JSON.stringify(msg));
            }
            if(res === 'a' || res === 'A') {
                const msg = {cmd: 'sortByAuthor', param: new Folder({children: data.result})};
                client.write(JSON.stringify(msg));
            }
            if(res === 'd' || res === 'D') {
                const msg = {cmd: 'sortByDownloadCount', param: new Folder({children: data.result})};
                client.write(JSON.stringify(msg));
            }
            if(res === 'n' || res === 'N') {
                const msg = {cmd: 'sortByName', param: new Folder({children: data.result})};
                client.write(JSON.stringify(msg));
            }
            if(!isNaN(res)) {
                const elem = data.result[res];
            
                if(elem instanceof Folder) {
                    const msg = {cmd: "getChilder", param: elem};
                    client.write(JSON.stringify(msg));
                }
    
                if(elem instanceof File) {
                    const msg = {cmd: "getRating", param: elem};
                    client.write(JSON.stringify(msg));
                }
            }
        });       
    }
});

client.on('close', function() {
	console.log('Connection closed');
});

function showFolder(data = [], callback) {
    
    for(let i = 0; i < data.length; i++) {
        console.log(`${i}. ${data[i].name}`);
    }

    console.log("\nTo get information about file or to go to folder enter its number ");
    console.log("To display sorted by name press 'n'");
    console.log("To display sorted by rating press 'r'");
    console.log("To display sorted by downloads press 'd'");
    console.log("To display sorted by author press 'a'");

    rl.question('Enter: ', (answer) => {
        callback(answer);
    });
}

function showFile(file, callback) {
    console.log(`\nName: ${file.name}`);
    console.log(`Size: ${file.size}`);
    console.log(`Rating: ${file.rating}`);
    console.log(`Downloads: ${file.downloadCount}\n`);

    console.log("\nTo delete file press 'd': ");
    console.log("To return to root press 'a': ");

    rl.question('Enter: ', (answer) => {
        callback(answer);
    });
}

