import { createEffect } from "@lincode/reactivity"
import { mouseEvents } from "../../../../api/mouse"
import { getWorldPlayComputed } from "../../../../states/useWorldPlayComputed"
import { clearMultipleSelectionTargets } from "../../../../states/useMultipleSelectionTargets"
import {
    getSelectionTarget,
    setSelectionTarget
} from "../../../../states/useSelectionTarget"
import pickable from "./pickable"
import {
    clickSet,
    mouseDownSet,
    mouseUpSet,
    mouseOverSet,
    mouseOutSet,
    mouseMoveSet
} from "./sets"
import VisibleMixin from "../../mixins/VisibleMixin"

createEffect(() => {
    if (!getWorldPlayComputed()) return

    const selectionTargetBackup = getSelectionTarget()

    clearMultipleSelectionTargets()
    setSelectionTarget(undefined)

    const handle0 = pickable("click", clickSet, (obj, e) => obj.onClick?.(e))
    const handle1 = pickable("down", mouseDownSet, (obj, e) =>
        obj.onMouseDown?.(e)
    )
    const handle2 = pickable("up", mouseUpSet, (obj, e) => obj.onMouseUp?.(e))

    let moveSet = new Set<VisibleMixin>()
    let moveSetOld = new Set<VisibleMixin>()

    const handle3 = pickable("move", mouseOverSet, (obj, e) => {
        moveSet.add(obj)
        obj.userData.eMove = e
    })
    const handle4 = pickable("move", mouseOutSet, (obj, e) => {
        moveSet.add(obj)
        obj.userData.eMove = e
    })
    const handle5 = pickable("move", mouseMoveSet, (obj, e) => {
        moveSet.add(obj)
        obj.userData.eMove = e
    })
    const handle6 = mouseEvents.on("move", () => {
        for (const obj of moveSet) {
            if (!moveSetOld.has(obj)) obj.onMouseOver?.(obj.userData.eMove)

            obj.onMouseMove?.(obj.userData.eMove)
        }
        for (const obj of moveSetOld)
            if (!moveSet.has(obj)) obj.onMouseOut?.(obj.userData.eMove)

        moveSetOld = moveSet
        moveSet = new Set()
    })

    return () => {
        handle0.cancel()
        handle1.cancel()
        handle2.cancel()
        handle3.cancel()
        handle4.cancel()
        handle5.cancel()
        handle6.cancel()
        !getSelectionTarget() && setSelectionTarget(selectionTargetBackup)
    }
}, [getWorldPlayComputed])
