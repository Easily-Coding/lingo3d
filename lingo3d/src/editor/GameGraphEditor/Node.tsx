import { valueof } from "@lincode/utils"
import { useMemo } from "preact/hooks"
import { uuidMap } from "../../api/core/collections"
import { GameGraphData } from "../../interface/IGameGraph"
import usePan, { PanEvent } from "../hooks/usePan"
import getDisplayName from "../utils/getDisplayName"

type NodeProps = {
    uuid: string
    data: valueof<GameGraphData>
    onPan?: (e: PanEvent) => void
}

const Node = ({ uuid, data, onPan }: NodeProps) => {
    const manager = useMemo(() => uuidMap.get(uuid), [uuid])
    const displayName = useMemo(
        () => manager && getDisplayName(manager),
        [manager]
    )
    const pressRef = usePan({ onPan })
    if (!manager) return null

    return (
        <div
            style={{
                width: 200,
                height: 300,
                background: "rgba(255, 255, 255, 0.1)",
                position: "absolute",
                left: data.x,
                top: data.y
            }}
        >
            <div style={{ fontSize: 20, marginTop: -24 }} ref={pressRef}>
                {displayName}
            </div>
        </div>
    )
}

export default Node