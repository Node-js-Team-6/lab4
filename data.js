// ----------- data access layer -----------------
const fs = require('fs');
const util = require('util')

const readFileAsync = util.promisify(fs.readFile);
const writefileAsync = util.promisify(fs.writeFile);

class Repository {

    constructor(filePath, mapToCustomTypeFunction, logger = null) {
        this.filePath = filePath;
        this.logger = logger;
        this.dataMapperToCustomType = mapToCustomTypeFunction;

        this.Data = [];
        this._nextId = 0;
    }

    async readData() {
        this.Data = await this.readAllAsync();
        this._nextId = Math.max(this.Data.map(o => o.id));
    }

    async writeData() {
        await this.writeAllAsync();
    }

    readAllCallback(callback = function() {}) {
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

                callback(this.getCustomizedObjects(data));
            }
        });
    }

    readAllAsyncPromise() {
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

                    resolve(this.getCustomizedObjects(data));
                }
            })
        });
    }

    async readAllAsync() {
        const start = Date.now();
        
        try {
            let data = await readFileAsync(this.filePath, 'utf-8');
            const end = Date.now();
            const msg = `${end}. Data was read from file "${this.filePath}". Reading took ${end - start}s\n`;
            this.logger.log(msg);

            return this.getCustomizedObjects(data);
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
    
    getCustomizedObjects = (string) => {
        
        const source = JSON.parse(string);
        let data = [];

        for(const elem of source) {
            data.push(this.dataMapperToCustomType(elem));
        };

        return data;
    };

    insert(item) {
        item.id = this._nextId++;
        this.Data.push(item);
    }

    delete(id) {
        const ind = this.Data.indexOf(o => o.id === id);
        this.Data.splice(ind, 1);
    }

    addOrUpdate(item){
        if(this.find(item.id) == null){
            this.insert(item)
        } else {
            this.modify(item)
        }



    }

    find(id) {
        return this.Data.find(o => o.id === id);
    }

    findAll() {
        return this.Data;
    }

    modify(item) {
        const ind = this.Data.indexOf(o => o.id === id);
        if(ind > -1) {
            this.Data[ind] = item;
        }
    }


}


exports.Repositoty = Repository;