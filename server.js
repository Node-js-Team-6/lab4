var net = require('net');

var service = require('./buisness_logic');

var server = net.createServer(function (connection) {
    console.log('client connected');

    connection.on('data', async function (d) {
        const data = JSON.parse(d)
        if (data.cmd === 'getRoot'){
            let root = await service.getRoot();
            service.getChildren(root);
            let response = {success: true, cmd: data.cmd, result: root}
            connection.write(JSON.stringify(response));
        }

        if (data.cmd === 'getRating'){
            let file = data.param;
            let rating = await service.getRating(file);
            let response = {success: true, cmd: data.cmd, result: rating}
            connection.write(JSON.stringify(response));
        }

        if (data.cmd === 'getChildren'){
            let folder = data.param;
            await service.getChildren(folder);
            let response = {success: true, cmd: data.cmd, result: folder.children}
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'addOrUpdateFile'){
            let file = data.param;
            await service.addOrUpdateFile(file);
            let response = {success: true, cmd: "CRUD"};
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'addOrUpdateRating'){
            let rating = data.param;
            await service.addOrUpdateRating(rating);
            let response = {success: true, cmd: "CRUD"};
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'addOrUpdateFolder'){
            let folder = data.param;
            await service.addOrUpdateFolder(folder);
            let response = {success: true, cmd: "CRUD"};
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'addOrUpdateUser'){
            let user = data.param;
            await service.addOrUpdateUser(user);
            let response = {success: true, cmd: "CRUD"};
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'deleteFile'){
            await service.deleteFile(data.param);
            let response = {success: true, cmd: "CRUD"};
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'deleteFolder'){
            await service.deleteFolder(data.param);
            let response = {success: true, cmd: "CRUD"};
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'sortByDownloadCount'){
            let folder = data.param;
            service.sortByDownloadCount(folder);
            let response = {success: true, cmd: 'SortSearch', result: folder}
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'sortByRating'){
            let folder = data.param;
            service.sortByRating(folder);
            let response = {success: true, cmd: 'SortSearch', result: folder}
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'sortByAuthor'){
            let folder = data.param;
            service.sortByAuthor(folder);
            let response = {success: true, cmd: 'SortSearch', result: folder}
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'sortByName'){
            let folder = data.param;
            service.sortByName(folder);
            let response = {success: true, cmd: 'SortSearch', result: folder}
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'findFileByName'){
            let folder = data.param;
            folder = service.findFileByName(folder);
            let response = {success: true, cmd: 'SortSearch', result: folder}
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'findFileByExtension'){
            let folder = data.param;
            folder = service.findFileByExtension(folder);
            let response = {success: true, cmd: 'SortSearch', result: folder}
            connection.write(JSON.stringify(response));
        }

        else if (data.cmd === 'saveCurrentState') {
            await service.saveCurrentState();
        }

        else if (data.cmd === 'returnToPreviousVersion') {
            service.returnToPreviousVersion();
            let response = {success: true, cmd: 'CRUD'}
            connection.write(JSON.stringify(response));
        }

    })

    connection.on('end', function() {
        console.log('client disconnected');
    });

    connection.write('Hello World!\r\n');
    connection.pipe(connection);
});

server.listen(20202, function() {
    console.log('server is listening');
});