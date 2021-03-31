// --------- custom classes -------------

class File{
    id;
    name;
    extension;
    userId;
    user;
    size;
    downloadCount;
    rating;
    constructor(data){
        Object.assign(this, data);
    }

    jsonify()
    {
        return {id: this.id, name: this.name, extension: this.extension, userId: this.userId, size: this.size,
            downloadCount: this.downloadCount}
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
    constructor(data){
        Object.assign(this, data);
    }

    jsonify()
    {
        return {parentId: this.parentId, id: this.id, name: this.name, userId: this.userId}
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

