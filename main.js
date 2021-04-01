const { Services } = require('./buisness_logic');

const { Folder } = require('./classes.js');
const { File } = require('./classes.js');
const { Rating } = require("./classes");
const { User } = require("./classes");

function main() {
    const getId = () => Math.floor(Math.random() * 1000);

    const user = new User({name: 'Vova', id: getId()});

    let root = new Folder({name: 'root', id: getId(), userId: user.id});
    root.path = Services.getPath(root, root);

    let folder1 = new Folder({name: 'homevideo', id: getId(), userId: user.id, parentId: root.id});

    let file1 = new File();
}