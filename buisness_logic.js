const data = require('./data.js')

const { Folder } = require('./classes.js');
const { File } = require('./classes.js');
const { Rating } = require("./classes");
const { User } = require("./classes");
const { VersionManager } = require('./versioning');

class Services {
    constructor() {
        const vm = new VersionManager('./database', './versionHistory.json');
        this.fileRepository = new data.Repositoty('./database/file.json', File.constructor, vm)
        this.folderRepository = new data.Repositoty('./database/classes.folder.json', Folder.constructor, vm)
        this.userRepository = new data.Repositoty('./database/user.json', User.constructor, vm)
        this.ratingRepository = new data.Repositoty('./database/rating.json', Rating.constructor, vm)
    }

    async addOrUpdateFile(file) {
        await fileRepository.addOrUpdate(file)
    }

    async deleteFile(file) {
        await fileRepository.delete(file)
    }

    async addOrUpdateFolder(folder) {
        await folderRepository.addOrUpdate(folder)
    }

    async deleteFolder(folder) {
        for (let c in folder.children) {
            if (c instanceof Folder) {
                deleteFolder(c)
            } else {
                deleteFile(c)
            }
        }

        await folderRepository.delete(folder)
    }

    async addOrUpdateUser(user) {
        await userRepository.addOrUpdate(user)
    }

    sortByDownloadCount(folder) {
        folder.children.sort((a, b) => (a instanceof Folder || b instanceof Folder) ? 1 :
            b.downloadCount - a.downloadCount);
    }

    sortByRating(folder) {
        folder.children.sort((a, b) => (a instanceof Folder || b instanceof Folder) ? 1 :
            b.rating - a.rating);
    }

    sortByAuthor() {
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

    getPath(element, root) {
        if (element.id === root.id)
            return element.name;
        return getPath(folderRepository.find(element.parentId), root) + '/' + element.name;
    }
}

exports.Services = Services;