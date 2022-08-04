import { Object3D, Vector3 } from "three"
import { onAfterRender } from "../../events/onAfterRender"

const cache = new WeakMap<Object3D, Vector3>()

export default (object3d: Object3D) => {
    if (cache.has(object3d)) return cache.get(object3d)!.clone()

    const result = object3d.getWorldDirection(new Vector3())

    cache.set(object3d, result.clone())
    onAfterRender(() => cache.delete(object3d), true)

    return result
}
