import { Component } from '@angular/core';

@Component({
    selector: 'file-uploader',
    template: require('./file-uploader.component.html'),
    styles: [require('./file-uploader.component.scss')],
})
export class FileUploaderComponent {
    constructor (){}

    onOnInit() {

    }

    upload() {
        // get all files
        let fileNode = document.getElementById('files') as HTMLInputElement;
        let files = fileNode.files;
        let sentCount = 0;
        let uploadedCount = 0;

        // check files
        if (files.length == 0) {
            return;
        }

        let ws = new WebSocket('ws://localhost:3100/api/add-files');
        ws.onopen = () => {
            // send all files
            let message = {
                user_id: 'user_1',
                folder_id: '1',
            };
            ws.send(JSON.stringify(message));
        };

        ws.onclose = () => {
            console.log('closing websocket');
        }

        ws.onerror = (err) => {
            console.error('error: ', err);
        }

        ws.onmessage = (event) => {
            console.log('message: ', event);
            // on start
            // send first file
            let message = JSON.parse(event.data);
            if (message.type == 'start') {
                ws.send(files[0]);
                sentCount += 1;
            }

            // on message file received
            // send another file
            if (message.type == 'saved' && sentCount < files.length) {
                ws.send(files[sentCount]);
                sentCount += 1;
                console.log(`sent ${sentCount} files`);
            }

            // on message file uploaded
            // update the progress bar
            if (message.type == 'uploaded') {
                uploadedCount += 1;
                console.log(`uploaded ${uploadedCount} files`);
            }
        };
    }

}