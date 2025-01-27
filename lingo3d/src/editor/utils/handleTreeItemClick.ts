import { Object3D } from "three"
import Appendable from "../../api/core/Appendable"
import { toggleRightClickPtr } from "../../api/mouse"
import { handleFocus } from "../../engine/hotkeys"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { setSelectionNativeTarget } from "../../states/useSelectionNativeTarget"
import { setWorldPlay } from "../../states/useWorldPlay"

export default (
    e: Event,
    target?: Appendable | Object3D,
    rightClick?: boolean,
    nativeParent?: Appendable
) => {
    setWorldPlay(false)
    handleFocus(e)
    queueMicrotask(() => {
        rightClick && toggleRightClickPtr()
        if (target instanceof Object3D) {
            emitSelectionTarget(nativeParent, true)
            setSelectionNativeTarget(target)
        } else emitSelectionTarget(target, true)
    })
}
