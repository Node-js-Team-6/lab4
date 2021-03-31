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



function addOrUpdateFile(file){
    fileRepository.addOrUpdate(file)
}

function deleteFile(file){
    fileRepository.delete(file)
}

function addOrUpdateFolder(folder){
    folderRepository.addOrUpdate(folder)
}

function deleteFolder(folder){
    folderRepository.delete(folder)
}


function addOrUpdateUser(user){
    userRepository.addOrUpdate(user)
}

function deleteUser(user){
    userRepository.delete(user)
}

function sortByDownloadCount(folder)
{
    folder.children.sort( (a, b) => (a instanceof Folder || b instanceof Folder) ? 1 :
        b.downloadCount - a.downloadCount);
}

function sortByRating(folder)
{
    folder.children.sort((a, b) => (a instanceof Folder || b instanceof Folder) ? 1 :
        b.rating - a.rating);
}

function sortByAuthor()
{
    folder.children.sort(function (a, b) {
        if (a.user.name > b.user.name) return 1;
        if (a.user.name < b.user.name) return -1;
        return 0});
}

function sortByName(folder)
{
    folder.children.sort(function (a, b) {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0});
}

function findFileByName(folder, searchText) {
    return folder.children.filter(file => file.name.startsWith(searchText));
}

function findFileByExtension(folder, searchText) {
    return folder.children.filter(file => !(file instanceof Folder) && file.extension.startsWith(searchText));
}

function getPath(element, root){
    if (element.id === root.id)
        return element.name;
    return getPath(folderRepository.find(element.parentId), root) + '/' + element.name;
}