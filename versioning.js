const zlib = require('zlib');
const fs = require('fs');
const pako = require('pako');

class VersionManager {
    constructor(dataPath, logger = console) {
        this.logger = logger;
        this.dataPath = dataPath;
        this.initial = './Versions';
        this.listeners = []
    }

    saveVersion() {

        fs.readdir(this.dataPath, (err, files) => {
            if(err) {
                const msg = `${Date.now()}. an error occured while reading data from file "${this.dataPath}"\n Error: "${err}"\n`;
                this.logger.log(msg); 
            }
            else {
                this.logger.log(files)
                files.forEach(filename => {
                    const fileContents = fs.createReadStream(`${this.dataPath}/${filename}`);
                    const writeStream = fs.createWriteStream(`${this.initial}/${filename}.gz`);
                    const zip = zlib.createGzip();
                    fileContents.pipe(zip).pipe(writeStream);
                })

                this.logger.log(`Version saved\n`);
            }
        });		
    }

    rollbackVersion() {
        
        fs.readdir(this.initial, (err, files) => {
            if(err) {
                const msg = `${Date.now()}. an error occured while reading data from file "${this.initial}"\n Error: "${err}"\n`;
                this.logger.log(msg); 
            }
            else {
                files.forEach(filename => {
                    const fileContents = fs.createReadStream(`${this.initial}/${filename}`);
                    const writeStream = fs.createWriteStream(`${this.dataPath}/${filename.slice(0, -3)}`);
                    const unzip = zlib.createGunzip();
                    fileContents.pipe(unzip).pipe(writeStream);
                });

                this.logger.log(`Version rolled back to the saved one\n`);
                this.listeners.forEach(l => l.readData());
            }
        });	
    }

    saveVersionPako() {

        fs.readdir(this.dataPath, (err, files) => {
            if(err) {
                const msg = `${Date.now()}. an error occured while reading data from file "${this.dataPath}"\n Error: "${err}"\n`;
                this.logger.log(msg);
            }
            else {
                this.logger.log(files)
                files.forEach(filename => {
                    const fileContents = fs.readFileSync(`${this.dataPath}/${filename}`);
                    const compressed = pako.deflate(fileContents);
                    const writeStream = fs.writeFileSync(`${this.initial}/${filename}.pk`, compressed);
                })
                this.logger.log(`Version saved\n`);
            }
        });
    }

    saveVersionZip() {

        fs.readdir(this.dataPath, (err, files) => {
            if(err) {
                const msg = `${Date.now()}. an error occured while reading data from file "${this.dataPath}"\n Error: "${err}"\n`;
                this.logger.log(msg); 
            }
            else {
                files.forEach(filename => {
                    let zip = new require('node-zip')();
                    zip.file(`${filename}`, fs.readFileSync(`${this.dataPath}/${filename}`));
                    const data = zip.generate({ base64: false, compression: 'DEFLATE' });
                    fs.writeFileSync(`${this.initial}/${filename}.zip`, data, 'binary');
                })

                this.logger.log(`Version saved\n`);
            }
        });	
    }

    rollbackVersionZip() {
        fs.readdir(this.initial, (err, files) => {
            if(err) {
                const msg = `${Date.now()}. an error occured while reading data from file "${this.initial}"\n Error: "${err}"\n`;
                this.logger.log(msg); 
            }
            else {
                files.forEach(filename => {
                    console.log(files)
                    console.log(`${this.initial}/${filename}`)
                    const data = fs.readFileSync(`${this.initial}/${filename}`, 'binary');
                    console.log(data)
                    var zip = new require('node-zip')(data, {base64: false, checkCRC32: true});
                    console.log(zip)
                    console.log(`${this.dataPath}/${filename.slice(0, -4)}`)
                    fs. writeFileSync(`${this.dataPath}/${filename.slice(0, -4)}`, zip.files[`${this.initial}/${filename}`])
                });

                this.logger.log(`Version rolled back to the saved one\n`);
                this.listeners.forEach(l => l.readData());
            }
        });	
    }

    rollbackVersionPako() {

        fs.readdir(this.dataPath, (err, files) => {
            if(err) {
                const msg = `${Date.now()}. an error occured while reading data from file "${this.dataPath}"\n Error: "${err}"\n`;
                this.logger.log(msg);
            }
            else {
                files.forEach(filename => {
                    let binData = fs.readFileSync(`${this.initial}/${filename}.pk`);
                    var data = pako.inflate(binData);
                    var strData = String.fromCharCode.apply(null, new Uint16Array(data));
                    fs.writeFileSync(`${this.dataPath}/${filename}`, strData, 'binary');
                })

                this.logger.log(`Version saved\n`);
                this.listeners.forEach(l => l.readData());
            }
        });
    }

    subscribe_for_rollback(event_handler)
    {
        this.listeners.push(event_handler);
    }
}

exports.VersionManager = VersionManager;