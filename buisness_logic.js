const data = require('./data.js')

const { Folder } = require('./classes.js');
const { File } = require('./classes.js');
const { Rating } = require("./classes.js");
const { User } = require("./classes.js");
const { VersionManager } = require('./versioning.js');

class Services {
    constructor() {
        this.vm = new VersionManager('./database', './Versions/version_history.json');
        this.fileRepository = new data.Repositoty('./database/file.json', File.objectify)
        this.folderRepository = new data.Repositoty('./database/folder.json', Folder.objectify)
        this.userRepository = new data.Repositoty('./database/user.json', User.objectify)
        this.ratingRepository = new data.Repositoty('./database/rating.json', Rating.objectify)

        this.vm.subscribe_for_rollback(this.fileRepository.readData);
        this.vm.subscribe_for_rollback(this.folderRepository.readData);
        this.vm.subscribe_for_rollback(this.userRepository.readData);
        this.vm.subscribe_for_rollback(this.ratingRepository.readData);
    }

    async addOrUpdateFile(file) {
        await this.fileRepository.addOrUpdate(file)
    }

    async addOrUpdateRating(rating) {
        await this.ratingRepository.addOrUpdate(rating);
    }

    async deleteFile(file) {
        await this.fileRepository.delete(file)
    }

    async addOrUpdateFolder(folder) {
        await this.folderRepository.addOrUpdate(folder)
    }

    async getChildren(folder){
        let folderChildren = await this.folderRepository.findAll().filter(f => f.parentId === folder.id);
        let fileChildren = await this.fileRepository.findAll().filter(f => f.parentId === folder.id)
        folder.children = [...folderChildren, ...fileChildren]
    }

    async getRoot()
    {
        return await this.folderRepository.find(994);
    }

    async getRating(file)
    {
        let ratings = await this.ratingRepository.findAll();
        let sum = ratings.filter(r => r.fileId === file.id).reduce((a, b) => a+b, 0)
        return sum / ratings.length;
    }

    async deleteFolder(folder) {
        for (let c in folder.children) {
            if (c instanceof Folder) {
                await this.deleteFolder(c)
            } else {
                await this.deleteFile(c)
            }
        }

        await this.folderRepository.delete(folder)
    }

    async addOrUpdateUser(user) {
        await this.userRepository.addOrUpdate(user)
    }

    async addOrUpdateRating(rating) {
        await this.ratingRepository.addOrUpdate(rating);
    }

    sortByDownloadCount(folder) {
        folder.children.sort((a, b) => (a instanceof Folder || b instanceof Folder) ? 1 :
            b.downloadCount - a.downloadCount);
    }

    sortByRating(folder) {
        folder.children.sort((a, b) => (a instanceof Folder || b instanceof Folder) ? 1 :
            b.rating - a.rating);
    }

    sortByAuthor(folder) {
        folder.children.sort(function (a, b) {
            if (a.user.name > b.user.name) return 1;
            if (a.user.name < b.user.name) return -1;
            return 0
        });
    }

    sortByName(folder) {
        folder.children.sort(function (a, b) {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0
        });
    }


    findFileByName(folder, searchText) {
        return folder.children.filter(file => file.name.startsWith(searchText));
    }

    findFileByExtension(folder, searchText) {
        return folder.children.filter(file => !(file instanceof Folder) && file.extension.startsWith(searchText));
    }

    async getPath(element, root) {
        if (element.id === root.id)
            return element.name;
        return await this.getPath(await this.folderRepository.find(element.parentId), root) + '/' + element.name;
    }

    async saveCurrentState(){
        await this.vm.saveVersion();
    }

    async returnToPreviousVersion()
    {
        await this.vm.rollbackVersion();
    }
}

exports.Services = Services;