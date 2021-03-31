// ----------- data access layer -----------------
const fs = require('fs');
const util = require('util')
const classes = require('./classes.js');

const readFileAsync = util.promisify(fs.readFile);
const writefileAsync = util.promisify(fs.writeFile);

class Repository {

    constructor(filePath, mapToCustomTypeFunction, logger = null) {
        this.filePath = filePath;
        this.logger = logger;
        this.dataMapperToCustomType = mapToCustomTypeFunction;

        this.Data = [];
    }

    async readData() {
        this.Data = await this.findAllAsync();
    }

    async writeData() {
        await this.writeAllAsync();
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
                const msg = `${end}. Data was read from file "${this.filePath}". Reading took ${end - start}s\n`;
                this.logger.log(msg);

                callback(this.getData(data));
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
                    const msg = `${end}. Data was read from file "${this.filePath}". Reading took ${end - start}s\n`;
                    this.logger.log(msg);

                    resolve(this.getData(data));
                }
            })
        });
    }

    async findAllAsync() {
        const start = Date.now();
        
        try {
            let data = await readFileAsync(this.filePath, 'utf-8');
            const end = Date.now();
            const msg = `${end}. Data was read from file "${this.filePath}". Reading took ${end - start}s\n`;
            this.logger.log(msg);

            return this.getData(data);
        }
        catch(err) {
            const msg = `${start}. an error occured while reading data from file "${this.filePath}"\n Error: "${err}"`;
            this.logger.log(msg);  
        }
    }

    async writeAllAsync() {
        const start = Date.now();
        
        try {
            let data = [];
            for(const item in this.Data) {
                data.push(item.jsonify());
            }
            const str = JSON.stringify(data);

            data = await writefileAsync(this.filePath, str, 'utf-8');
            const end = Date.now();
            const msg = `${end}. Data was written to file "${this.filePath}". Writing took ${end - start}s\n`;
            this.logger.log(msg);
        }
        catch(err) {
            const msg = `${start}. an error occured while reading data from file "${this.filePath}"\n Error: "${err}"`;
            this.logger.log(msg);  
        }
    }
    
    getData = (string) => {
        
        const source = JSON.parse(string);
        let data = [];

        for(const elem of source) {
            data.push(this.dataMapperToCustomType(elem));
        };

        return data;
    };

    insert(item) {
        this.Data.push(item);
    }

    delete(item) {
    }

    find(id) {

    }

    modify(item) {
        
    }


}


exports.Repositoty = Repository;