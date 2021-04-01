const { Services } = require('./buisness_logic');

const { Folder } = require('./classes.js');
const { File } = require('./classes.js');
const { Rating } = require("./classes");
const { User } = require("./classes");

function main() {
    const getId = () => Math.floor(Math.random() * 1000);
    const services = new Services();

    const user = new User({name: 'Vova', id: getId()});
    const user2 = new User({name: 'Misha', id: getId()});

    let root = new Folder({name: 'root', id: getId(), userId: user.id});
    root.path = services.getPath(root, root);

    let folder1 = new Folder({name: 'homevideo', id: getId(), userId: user.id, parentId: root.id});
    folder1.path = services.getPath(folder1, root);

    let file1 = new File({id: getId(), name: 'chm_lab2.py', parentId: root.id, user: user.id, size: '2Kb', downloadCount: 0});
    file1.path = services.getPath(file1, root);

    let file2 = new File({id: getId(), name: 'smtrpz_kr1.mkv', parentId: folder1.id, user: user.id, size: '5Gb', downloadCount: 3});
    file2.path = services.getPath(file2, root);

    let file3 = new File({id: getId(), name: 'report_lab2.pdf', parentId: root.id, user: user.id, size: '2Mb', downloadCount: 1});
    file3.path = services.getPath(file3, root);

    const rating1 = new Rating({id: getId(), userId: user.id, fileId: file2.id, score: 5});
    const rating2 = new Rating({id: getId(), userId: user2.id, fileId: file2.id, score: 3});
}