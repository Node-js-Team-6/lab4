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
}

class Folder{
    parentId;
    parent;
    id;
    name;
    userId;
    user;
    downloadCount;
    children;
    constructor(data){
        Object.assign(this, data);
    }
}

class User{
    id;
    name;
    constructor(data){
        Object.assign(this, data);
    }
}

class Rating{
    id;
    userId;
    fileId;
    constructor(data){
        Object.assign(this, data);
    }
}

exports = {
    File: File,
    Folder: Folder,
    User: User,
    Rating: Rating
};
