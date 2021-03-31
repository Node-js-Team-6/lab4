const data = require('./data.js')
const classes = require('./classes.js')

const {Folder} = require('./classes.js');
const {File} = require('./classes.js');
const {Rating} = require("./classes");
const {User} = require("./classes");


let fileRepository = new data.Repositoty('./database/file.json', File.constructor)
let folderRepository = new data.Repositoty('./database/classes.folder.json', Folder.constructor)
let userRepository = new data.Repositoty('./database/user.json', User.constructor)
let ratingRepository = new data.Repositoty('./database/rating.json', Rating.constructor)



function addFile(file){
    fileRepository.insert(file)
}

function deleteFile(file){
    fileRepository.delete(file)
}

function addFolder(folder){
    folderRepository.insert(folder)
}

function deleteFolder(folder){
    folderRepository.delete(folder)
}


function addUser(user){
    userRepository.insert(user)
}

function deleteUser(user){
    userRepository.delete(user)
}






function sortByDownloadCount()
{
    let currentFolder = Folder.from(JSON.parse(window.localStorage.getItem('currentFolder')));
    currentFolder.children.sort((a, b) => b.downloadCount - a.downloadCount);
    window.localStorage.setItem('currentFolder', JSON.stringify(currentFolder));
    bodyRender();
}

function sortByRating()
{
    let currentFolder = Folder.from(JSON.parse(window.localStorage.getItem('currentFolder')));
    currentFolder.children.sort((a, b) => b.rating - a.rating);
    window.localStorage.setItem('currentFolder', JSON.stringify(currentFolder));
    bodyRender();
}

function sortByAuthor()
{
    let currentFolder = Folder.from(JSON.parse(window.localStorage.getItem('currentFolder')));
    currentFolder.children.sort(function (a, b) {
        if (a.user.name > b.user.name) return 1;
        if (a.user.name < b.user.name) return -1;
        return 0});
    window.localStorage.setItem('currentFolder', JSON.stringify(currentFolder));
    bodyRender();
}

function sortByName()
{
    let currentFolder = Folder.from(JSON.parse(window.localStorage.getItem('currentFolder')));
    currentFolder.children.sort(function (a, b) {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0});
    window.localStorage.setItem('currentFolder', JSON.stringify(currentFolder));
    bodyRender();
}

function findFileByName() {
    const folder = Folder.from(JSON.parse(window.localStorage.getItem('all')));
    let q = document.getElementById("fileNameSearch").value;
    if (q === "" || q === null) {
        window.localStorage.setItem('currentFolder', JSON.stringify(folder));
        bodyRender();
        return;
    }
    let res = folder.children.filter(file => file.name.startsWith(q));
    folder.children = res;
    window.localStorage.setItem('currentFolder', JSON.stringify(folder));
    bodyRender();
}

function findFileByExtension() {
    const folder = Folder.from(JSON.parse(window.localStorage.getItem('all')));
    let q = document.getElementById("fileExtensionSearch").value;
    if (q === "" || q === null) {
        window.localStorage.setItem('currentFolder', JSON.stringify(folder));
        bodyRender();
        return;
    }
    let res = folder.children.filter(file => file.extension.startsWith(q));
    folder.children = res;
    window.localStorage.setItem('currentFolder', JSON.stringify(folder));
    bodyRender();
}