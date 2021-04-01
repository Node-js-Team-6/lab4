const zlib = require('zlib');
const fs = require('fs');

class VersionManager {
    constructor(dataPath, innerDatafileName, logger = console) {
        this.logger = logger;
        this.history = [];
        this.innerDatafileName = innerDatafileName;
        this.initial = './Versions/';
        this.dataPath = dataPath;
        this.listeners = []
        this.history = this.readData(this.innerDatafileName);
    }

    saveVersion() {
        const versionName = Date.now();

        fs.readdir(this.dataPath, (err, files) => {
            if(err) {
                const msg = `${Date.now()}. chchchhchchchc an error occured while reading data from file "${this.dataPath}"\n Error: "${err}"\n`;
                this.logger.log(msg); 
            }
            else {
                fs.mkdirSync(`${this.initial+versionName}`);
                files.forEach(filename => {
                    const fileContents = fs.createReadStream(`${this.dataPath}/${filename}`);
                    const writeStream = fs.createWriteStream(`${this.initial + versionName}/${filename}.gz`);
                    const zip = zlib.createGzip();
                    fileContents.pipe(zip).pipe(writeStream);
                })
        
                if(!this.history) {
                    this.history = [];
                }
                this.history.push(versionName);

                this.logger.log(`Version '${versionName}' saved\n`);
                this.writeData(this.innerDatafileName);
            }
        });		
    }

    rollbackVersion() {
        if (!this.history) {
            return;
        }

        const versionName = this.history.pop();
        
        fs.readdir(this.initial + versionName, (err, files) => {
            if(err) {
                const msg = `${Date.now()}. an gggggggggg error occured while reading data from file "${this.initial + versionName}"\n Error: "${err}"\n`;
                this.logger.log(msg); 
            }
            else {
                files.forEach(filename => {
                    const fileContents = fs.createReadStream(`${this.initial + versionName}/${filename}`);
                    const writeStream = fs.createWriteStream(`${this.dataPath}/${filename.slice(0, -3)}`);
                    const unzip = zlib.createGunzip();
                    fileContents.pipe(unzip).pipe(writeStream);
                });

                this.logger.log(`Version rolled back to ${versionName}\n`);
                this.writeData(this.innerDatafileName);
                this.listeners.forEach(l => l());
            }
        });	
    }

    readData = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    writeData = filePath =>
        new Promise((resolve, reject) => {
            fs.writeFile(filePath, JSON.stringify(this.history), 'utf-8', () => {
                const end = Date.now();
                const msg = `${end}. Data has been written to file "${filePath}"\n`;
                this.logger.log(msg);
            })
        });

    subscribe_for_rollback(event_handler)
    {
        this.listeners.push(event_handler);
    }
}

exports.VersionManager = VersionManager;