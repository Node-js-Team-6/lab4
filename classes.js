// --------- custom classes -------------

class File{
    parentId;
    parent;
    id;
    name;
    extension;
    userId;
    user;
    size;
    downloadCount;
    rating;
    path;
    constructor(data){
        Object.assign(this, data);
    }

    jsonify()
    {
        return {parentId: this.parentId, id: this.id, name: this.name, extension: this.extension, userId: this.userId,
            size: this.size, downloadCount: this.downloadCount, path: this.path}
    }
}

class Folder{
    parentId;
    parent;
    id;
    name;
    userId;
    user;
    children;
    path;
    constructor(data){
        Object.assign(this, data);
    }

    jsonify()
    {
        return {parentId: this.parentId, id: this.id, name: this.name, userId: this.userId, path: this.path}
    }

}

class User{
    id;
    name;
    constructor(data){
        Object.assign(this, data);
    }

    jsonify()
    {
        return {id: this.id, name: this.name}
    }
}

class Rating{
    id;
    userId;
    fileId;
    score;
    constructor(data){
        Object.assign(this, data);
    }

    jsonify()
    {
        return {id: this.id, userId: this.userId, fileId: this.fileId, score: this.score}
    }
}

module.exports.File = File;
module.exports.Folder = Folder;
module.exports.User = User;
module.exports.Rating = Rating;

