const zlib = require('zlib');
const fs = require('fs');

class VersionManager {
    constructor(folderPath, innerDatafileName, logger = console) {
        this.logger = logger;
        this.dataPath = folderPath;
        this.history = [];
        this.initial = './Versions';

        this.readData(innerDatafileName).then(value => this.history = value);
    }

    saveVersion() {
        const versionName = Date.now();

        const files = fs.readdirSync(this.initial + versionName);
        files.forEach(filename => {
            const fileContents = fs.createReadStream(`./database/${filename}`);
            const writeStream = fs.createWriteStream(`${this.initial + versionName}/${filename}.gz`);
            const zip = zlib.createGzip();
            fileContents.pipe(zip).pipe(writeStream);
        })

        if(!this.history) {
            this.history = [];
        }
        this.history.push(versionName);	
        
        logger.log("Version saved");		
    }

    rollbackVersion() {
        if (!this.history) {
            return;
        }

        const versionName = this.history.pop();

        const files = fs.readdirSync(this.initial + versionName);
        files.forEach(filename => {
            const fileContents = fs.createReadStream(`${this.initial + versionName}/${filename}.gz`);
            const writeStream = fs.createWriteStream(`./database/${filename.slice(0, -3)}`);
            const unzip = zlib.createGunzip();
            fileContents.pipe(unzip).pipe(writeStream);
        })
        
        logger.log("Version rolled back");
    }

    readData = (filePath) => 
        new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if(err) {
                    const msg = `${start}. an error occured while reading data from file "${filePath}"\n Error: "${err}"`;
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
    
}

exports.VersionManager = VersionManager;