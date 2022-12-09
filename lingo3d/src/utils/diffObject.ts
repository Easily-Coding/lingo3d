import { get, has } from "@lincode/utils"
import traverseObject from "./traverseObject"

export default (objOld: Record<string, any>, obj: Record<string, any>) => {
    const changes: Array<[Array<string | number>, any]> = []
    const deletes: Array<Array<string | number>> = []

    traverseObject(
        obj,
        (k, v, _, path) => get(objOld, path) !== v && changes.push([path, v])
    )
    traverseObject(
        objOld,
        (k, v, _, path) => !has(obj, path) && deletes.push(path)
    )
    return <const>[changes, deletes]
}
