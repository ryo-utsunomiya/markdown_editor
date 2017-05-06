import {BrowserWindow, ipcMain} from "electron";
import EventEmitter from "events";

class PDFWindow extends EventEmitter {
    constructor(text) {
        super(text);
        this.window = new BrowserWindow({show: true});
        this.window.loadURL(`file://${__dirname}/../../pdf.html`);
        ipcMain.once("REQUEST_TEXT", (e) => e.returnValue = text);
        ipcMain.once("RENDERED_CONTENTS", () => {
            this.emit("RENDERED_CONTENTS")
        });
    }

    generatePDF() {
        return new Promise((resolve, reject) => {
            this.window.webContents.printToPDF({}, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    close() {
        this.window.close();
        this.widow.on("closed", () => this.window = null);
    }
}

function createPDFWindow(contents) {
    return new PDFWindow(contents);
}

export default createPDFWindow;