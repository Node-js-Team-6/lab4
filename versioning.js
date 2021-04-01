const zlib = require('zlib');
const fs = require('fs');

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
                this.listeners.forEach(l => l());
            }
        });	
    }

    subscribe_for_rollback(event_handler)
    {
        this.listeners.push(event_handler);
    }
}

exports.VersionManager = VersionManager;