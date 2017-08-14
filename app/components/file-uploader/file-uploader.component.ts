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
        let files = [];
        let fileNode = document.getElementById('files');
        files = fileNode.files;

        // check files
        if (files.length == 0) {
            return;
        }

        let ws = new WebSocket('ws://localhost:3100/api/add-files');
        ws.onopen = () => {
            // send all files
            ws.send(files[0]);
        };

        ws.onclose = () => {
            console.log('closing websocket');
        }

        ws.onerror = (err) => {
            console.error('error: ', err);
        }

        ws.onmessage = (message) => {
            console.log('message: ', message);

            // on message file received
            // send another file

            // on message file uploaded
            // update the progress bar
        };
    }

}