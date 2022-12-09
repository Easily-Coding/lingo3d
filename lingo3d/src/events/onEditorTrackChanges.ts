import { createEffect } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import getChangedProperties, {
    ChangedProperties,
    saveProperties
} from "../display/utils/getChangedProperties"
import { getEditorMounted } from "../states/useEditorMounted"
import {
    multipleSelectionTargetsFlushingPtr,
    getMultipleSelectionTargets,
    flushMultipleSelectionTargets
} from "../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { onEditorEdit } from "./onEditorEdit"
import { onTransformControls } from "./onTransformControls"
import { event } from "@lincode/events"
import { debounceTrailing } from "@lincode/utils"
import { getTimelineFrame } from "../states/useTimelineFrame"
import Timeline from "../display/Timeline"
import { getTimeline } from "../states/useTimeline"
import { AnimationData } from "../interface/IAnimationManager"

// appendable, changed properties, timeline frame, timeline instance
export type Changes = Array<
    readonly [Appendable, ChangedProperties, number, Timeline?, AnimationData?]
>

export const [emitEditorTrackChanges, onEditorTrackChanges] = event<Changes>()

createEffect(() => {
    if (!getEditorMounted()) return

    const instances = new Set<Appendable>()
    const getInstances = debounceTrailing(() => {
        if (multipleSelectionTargetsFlushingPtr[0]) return
        instances.clear()
        for (const target of getMultipleSelectionTargets())
            instances.add(target)

        if (instances.size) return
        const target = getSelectionTarget()
        target && instances.add(target)
    })
    const handle0 = getSelectionTarget(getInstances)
    const handle1 = getMultipleSelectionTargets(getInstances)

    const handleStart = () => {
        for (const instance of instances) saveProperties(instance)
    }
    const handleFinish = () =>
        flushMultipleSelectionTargets(() => {
            const frame = getTimelineFrame()
            const timeline = getTimeline()
            const timelineDataSnapshot = structuredClone(timeline?.data)

            emitEditorTrackChanges(
                //todo: optimize array spread in the future
                [...instances].map(
                    (instance) =>
                        <const>[
                            instance,
                            getChangedProperties(instance),
                            frame,
                            timeline,
                            timelineDataSnapshot
                        ]
                )
            )
        })
    const handle2 = onTransformControls((val) => {
        if (val === "start") handleStart()
        else if (val === "stop") handleFinish()
    })
    const handle3 = onEditorEdit((val) => {
        if (val === "start") handleStart()
        else if (val === "stop") handleFinish()
    })
    const handle4 = getMultipleSelectionTargets((targets) => {
        for (const target of targets) saveProperties(target)
    })
    return () => {
        handle0.cancel()
        handle1.cancel()
        handle2.cancel()
        handle3.cancel()
        handle4.cancel()
    }
}, [getEditorMounted])