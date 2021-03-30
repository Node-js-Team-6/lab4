// --------- custom classes -------------

class File{
    constructor(id, name, extension, size, downloadCount, rating, user){
        this._id = id;
        this.name = name;
        this.extension = extension;
        this.user = user;
        this.size = size;
        this.downloadCount = downloadCount;
        this.rating = rating;
    }

    static from (data)
    {
        return new File(data._id, data.name, data.extension, data.size, data.downloadCount, data.rating, data.user);
    }

}

class Folder{
    constructor(id, name, idUser){
        this.parent = null;
        this._id = id;
        this.name = name;
        this.idUser = idUser;
        this.user = new User(-1, 'Unknown');
        this.downloadCount = 0;
        this.children = []
    }

    addChild(child)
    {
        this.children.push(child);
        //child.parent = this;
    }

    static from(data) {
        let f = new Folder(data._id, data.name, data.idUser);
        data.children.forEach( function (c){
            if (c.hasOwnProperty('children'))
            {
                f.addChild(Folder.from(c))
            }
            else
            {
                f.addChild(File.from(c));
            }
        })
        return f;
    }
}

class User{
    constructor(id, name){
        this._id = id;
        this.name = name;
    }
}

class Rating{
    constructor(id, idUser, idFile) {
        this._id = id;
        this.idUser = idUser;
        this.idFile = idFile;
    }
}

exports = {
    File: File,
    Folder: Folder,
    User: User,
    Rating: Rating
};