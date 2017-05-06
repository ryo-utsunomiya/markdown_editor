import {app} from "electron";
import createMainWindow from "./createMainWindow";
import setAppMenu from "./setAppMenu";
import showSaveAsNewFileDialog from "./showSaveAsNewFileDialog";
import showOpenFileDialog from "./showOpenFileDialog";
import showExportPDFDialog from "./showExportPDFDialog";
import createFileManager from "./createFileManager";
import createPDFWindow from "./createPDFWindow";

let mainWindow = null;
let fileManager = null;

function openFile() {
    showOpenFileDialog()
        .then((filePath) => fileManager.readFile(filePath))
        .then((text) => mainWindow.sendText(text))
        .catch((error) => console.error(error));
}

function saveFile() {
    if (!fileManager.filePath) {
        saveAsNewFile();
        return;
    }
    mainWindow.requestText()
        .then((text) => fileManager.overwriteFile(text))
        .catch((error) => console.error(error));
}

function saveAsNewFile() {
    Promise.all([showSaveAsNewFileDialog(), mainWindow.requestText()])
        .then(([filePath, text]) => fileManager.saveFile(filePath, text))
        .catch((error) => console.error(error));
}

function exportPDF() {
    Promise.all([showExportPDFDialog(), mainWindow.requestText()])
        .then(([filePath, text]) => {
            const pdfWindow = createPDFWindow(text);
            pdfWindow.on("RENDERED_CONTENTS", () => {
                pdfWindow.generatePDF()
                    .then((pdf) => fileManager.writePDF(filePath, pdf))
                    .then(() => pdfWindow.close())
                    .catch((error) => {
                        console.error(error);
                        pdfWindow.close();
                    });
            });
        })
        .catch((error) => console.error(error));
}

app.on("ready", () => {
    mainWindow = createMainWindow();
    fileManager = createFileManager();
    setAppMenu({openFile, saveFile, saveAsNewFile, exportPDF});
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", (_e, hasVisibleWindows) => {
    if (!hasVisibleWindows) {
        mainWindow = createMainWindow();
    }
});
