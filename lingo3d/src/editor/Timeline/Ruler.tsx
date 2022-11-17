import { APPBAR_HEIGHT, FRAME_WIDTH } from "../../globals"
import VirtualizedListHorizontal from "../component/VirtualizedListHorizontal"
import { useTimelineScrollLeft, useTimelineFrameNum } from "../states"
import Metric from "./Metric"

type RulerProps = {
    width: number
}

const Ruler = ({ width }: RulerProps) => {
    const [scrollLeft, setScrollLeft] = useTimelineScrollLeft()
    const [frameNum] = useTimelineFrameNum()

    return (
        <VirtualizedListHorizontal
            scrollLeft={scrollLeft}
            onScrollLeft={setScrollLeft}
            itemNum={frameNum / 5 + 1}
            itemWidth={FRAME_WIDTH * 5}
            containerWidth={width}
            containerHeight={APPBAR_HEIGHT}
            renderItem={({ index, style }) => (
                <Metric key={index} index={index} style={style} />
            )}
        />
    )
}

export default Ruler