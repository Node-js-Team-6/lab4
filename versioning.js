const zlib = require('zlib');
const fs = require('fs');

class VersionManager {
    constructor(dataPath, innerDatafileName, logger = console) {
        this.logger = logger;
        this.history = [];
        this.innerDatafileName = innerDatafileName;
        this.initial = './Versions/';
        this.dataPath = dataPath;

        this.readData(this.innerDatafileName).then(value => this.history = value);
    }

    async saveVersion() {
        const versionName = Date.now();

        fs.readdir(this.dataPath, (err, files) => {
            if(err) {
                const msg = `${Date.now()}. an error occured while reading data from file "${this.dataPath}"\n Error: "${err}"\n`;
                this.logger.log(msg); 
            }
            else {
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
                
                logger.log(`Version '${versionName}' saved\n`);
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
                const msg = `${Date.now()}. an error occured while reading data from file "${this.initial + versionName}"\n Error: "${err}"\n`;
                this.logger.log(msg); 
            }
            else {
                files.forEach(filename => {
                    const fileContents = fs.createReadStream(`${this.initial + versionName}/${filename}.gz`);
                    const writeStream = fs.createWriteStream(`${this.dataPath}/${filename.slice(0, -3)}`);
                    const unzip = zlib.createGunzip();
                    fileContents.pipe(unzip).pipe(writeStream);
                });
                    
                logger.log(`Version rolled back to ${versionName}\n`);
                this.writeData(this.innerDatafileName);
            }
        });	
    }

    readData = (filePath) => 
        new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if(err) {
                    const msg = `${start}. an error occured while reading data from file "${filePath}"\n Error: "${err}"\n`;
                    this.logger.log(msg);  
                    reject(err);            
                }
                else {
                    const end = Date.now();
                    const msg = `${end}. Data was read from file "${filePath}". Reading took ${end - start}s\n`;
                    this.logger.log(msg);

                    resolve(JSON.parse(data));
                }
            })
        });

    writeData = filePath =>
        new Promise((resolve, reject) => {
            fs.writeFile(filePath, JSON.stringify(this.history), 'utf-8', () => {
                const end = Date.now();
                const msg = `${end}. Data has been written to file "${filePath}"\n`;
                this.logger.log(msg);
            })
        });

}

exports.VersionManager = VersionManager;