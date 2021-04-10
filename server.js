const net = require('net');

const { Services } = require('./buisness_logic.js');
const service = new Services();

const server = net.createServer(function (connection) {
    console.log('client connected');

    connection.on('data', async function (d) {
        const data = JSON.parse(d);

        console.log('  Data:  ', data);

        if (data.cmd === 'getRootIn'){
            let root = await service.getRoot();
            await service.getChildren(root);
            let response = {success: true, cmd: data.cmd.slice(0, -2), result: root}
            connection.write(JSON.stringify(response));
        }

        if (data.cmd === 'getRatingIn'){
            let file = data.param;
            file.rating = await service.getRating(file);
            let response = {success: true, cmd: data.cmd.slice(0, -2), result: file}

            connection.write(JSON.stringify(response));
        }

        if (data.cmd === 'getChildrenIn'){
            let folder = data.param;
            await service.getChildren(folder);
            let response = {success: true, cmd: data.cmd.slice(0, -2), result: folder}

            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'addOrUpdateFileIn'){
            let file = data.param;
            await service.addOrUpdateFile(file);
            let response = {success: true, cmd: data.cmd.slice(0, -2)};
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'addOrUpdateRatingIn'){
            let rating = data.param;
            await service.addOrUpdateRating(rating);
            let response = {success: true, cmd: data.cmd.slice(0, -2)};
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'addOrUpdateFolderIn'){
            let folder = data.param;
            await service.addOrUpdateFolder(folder);
            let response = {success: true, cmd: data.cmd.slice(0, -2)};
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'addOrUpdateUserIn'){
            let user = data.param;
            await service.addOrUpdateUser(user);
            let response = {success: true, cmd: data.cmd.slice(0, -2)};
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'deleteFileIn'){
            await service.deleteFile(data.param);
            let response = {success: true, cmd: data.cmd.slice(0, -2)};
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'deleteFolderIn'){
            await service.deleteFolder(data.param);
            let response = {success: true, cmd: data.cmd.slice(0, -2)};
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'sortByDownloadCountIn'){
            let folder = data.param;
            service.sortByDownloadCount(folder);
            let response = {success: true, cmd: data.cmd.slice(0, -2), result: folder}
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'sortByRatingIn'){
            let folder = data.param;
            service.sortByRating(folder);
            let response = {success: true, cmd: data.cmd.slice(0, -2), result: folder}
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'sortByAuthorIn'){
            let folder = data.param;
            service.sortByAuthor(folder);
            let response = {success: true, cmd: data.cmd.slice(0, -2), result: folder}
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'sortByNameIn'){
            let folder = data.param;
            service.sortByName(folder);
            let response = {success: true, cmd: data.cmd.slice(0, -2), result: folder};
        
            console.log('     Response: ', response);

            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'findFileByNameIn'){
            let folder = data.param;
            folder = service.findFileByName(folder);
            let response = {success: true, cmd: data.cmd.slice(0, -2), result: folder}
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'findFileByExtensionIn'){
            let folder = data.param;
            folder = service.findFileByExtension(folder);
            let response = {success: true, cmd: data.cmd.slice(0, -2), result: folder}
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'saveCurrentStateIn') {
            await service.saveCurrentState();
        }

        else if (data.cmd === 'returnToPreviousVersionIn') {
            service.returnToPreviousVersion();
            let response = {success: true, cmd: data.cmd.slice(0, -2)}
            connection.write(JSON.stringify(response));
        }

    })

    connection.on('end', function() {
        console.log('client disconnected');
    });

    connection.pipe(connection);

    connection.on('uncaughtException', function (err) {
        console.log(err);
    }); 
});

server.listen(20202, function() {
    console.log('server is listening');
});