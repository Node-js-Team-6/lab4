// ----------- data access layer -----------------
const fs = require('fs');
const util = require('util')
const classes = require('./classes');

const readFileAsync = util.promisify(fs.readFile);

class DataReader {
    constructor(filePath, logger = null) {
        this.filePath = filePath;
        this.logger = logger;
    }

    findAllCallback(callback = function() {}) {
        const start = Date.now();

        fs.readFile(this.filePath, 'utf-8', (err, data) => {
            if(err) {
                const msg = `${start}. an error occured while reading data from file "${this.filePath}"\n Error: "${err}"`;
                this.logger.log(msg);              
            }
            else {
                const end = Date.now();
                const msg = `${end}. Data was read from file "${this.filePath}". Reading took ${end - start}s\n`
                this.logger.log(msg);

                //data to objects

                callback(data);
            }
        });
    }

    findAllAsyncPromise() {
        const start = Date.now();

        return new Promise((resolve, reject) => {
            fs.readFile(this.filePath, 'utf-8', (err, data) => {
                if(err) {
                    const msg = `${start}. an error occured while reading data from file "${this.filePath}"\n Error: "${err}"`;
                    this.logger.log(msg);  
                    reject(err);            
                }
                else {
                    const end = Date.now();
                    const msg = `${end}. Data was read from file "${this.filePath}". Reading took ${end - start}s\n`
                    this.logger.log(msg);

                    //data to objects

                    resolve(data);
                }
            })
        });
    }

    async findAllAsync() {
        const start = Date.now();
        
        try {
            data = await readFileAsync(this.filePath, 'utf-8');
            const end = Date.now();
            const msg = `${end}. Data was read from file "${this.filePath}". Reading took ${end - start}s\n`
            this.logger.log(msg);
            //data to object

            return //object;
        }
        catch(err) {
            const msg = `${start}. an error occured while reading data from file "${this.filePath}"\n Error: "${err}"`;
            this.logger.log(msg);  
        }
    }

    insert(item) {

    }

    delete(item) {

    }

    find(id) {

    }

    modify(item) {
        
    }
}