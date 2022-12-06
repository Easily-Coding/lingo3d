import { FRAME_HEIGHT, FRAME_MAX, FRAME_WIDTH } from "../../globals"
import { getTimeline } from "../../states/useTimeline"
import { getTimelineData } from "../../states/useTimelineData"
import { getTimelineExpandedUUIDs } from "../../states/useTimelineExpandedUUIDs"
import { setTimelineFrame } from "../../states/useTimelineFrame"
import { getTimelineKeyframeEntries } from "../../states/useTimelineKeyframeEntries"
import { setTimelineLayer } from "../../states/useTimelineLayer"
import { timelineScrollHeightSignal } from "../../states/useTimelineScrollHeight"
import { timelineScrollLeftSignal } from "../../states/useTimelineScrollLeft"
import useSyncState from "../hooks/useSyncState"
import FrameTweenRow from "./FrameTweenRow"
import useSyncScrollTop from "./useSyncScrollTop"

const Scroller = () => {
    const scrollRef = useSyncScrollTop()
    const keyframesEntries = useSyncState(getTimelineKeyframeEntries)

    return (
        <div
            className="lingo3d-absfull"
            style={{ overflow: "scroll" }}
            ref={scrollRef}
            onScroll={(e) =>
                (timelineScrollLeftSignal.value = e.currentTarget.scrollLeft)
            }
            onClick={(e) => {
                const el = scrollRef.current
                const [timelineData] = getTimelineData()
                const [expandedUUIDs] = getTimelineExpandedUUIDs()
                const timeline = getTimeline()
                if (!el || !timelineData || !timeline) return

                const bounds = el.getBoundingClientRect()
                const relX = e.clientX - bounds.x + el.scrollLeft
                const relY = e.clientY - bounds.y + el.scrollTop

                const testLayerClick = (i: number, layer: string) => {
                    const start = i * FRAME_HEIGHT
                    const end = start + FRAME_HEIGHT
                    if (start > relY || end < relY) return false
                    setTimelineLayer(layer)
                    return true
                }
                let i = 0
                loop1: for (const [uuid, data] of Object.entries(
                    timelineData
                )) {
                    if (testLayerClick(i++, uuid)) break
                    if (!expandedUUIDs.has(uuid)) continue
                    for (const property of Object.keys(data))
                        if (testLayerClick(i++, uuid + " " + property))
                            break loop1
                }

                const frame = (timeline.frame = Math.floor(relX / FRAME_WIDTH))
                setTimelineFrame(frame)
                timeline.paused = true
            }}
        >
            <div
                style={{
                    width: FRAME_MAX * FRAME_WIDTH,
                    height: timelineScrollHeightSignal.value
                }}
            >
                {keyframesEntries.map(([uuid, frames]) => (
                    <FrameTweenRow key={uuid} uuid={uuid} frames={frames} />
                ))}
            </div>
        </div>
    )
}

export default Scroller