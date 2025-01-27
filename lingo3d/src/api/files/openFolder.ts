import {
    directoryOpen,
    FileWithDirectoryAndFileHandle
} from "browser-fs-access"
import { setFileBrowser } from "../../states/useFileBrowser"
import { setFiles } from "../../states/useFiles"
import loadFile from "./loadFile"

const isFileArray = (files: any): files is FileWithDirectoryAndFileHandle[] =>
    files[0] && "webkitRelativePath" in files[0]

export default async () => {
    const f = await directoryOpen({
        recursive: true,
        startIn: "downloads",
        id: "lingo3d",
        skipDirectory: (entry) =>
            entry.name[0] === "." || entry.name === "node_modules"
    })
    const files = isFileArray(f) ? f : []
    setFiles(files)
    setFileBrowser(true)
    for (const file of files)
        if (file.webkitRelativePath.split("/").length < 3)
            if (await loadFile(file)) return
}
