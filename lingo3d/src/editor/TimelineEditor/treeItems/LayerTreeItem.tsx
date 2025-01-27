import { ComponentChildren } from "preact"
import { useLayoutEffect, useMemo, useState } from "preact/hooks"
import { uuidMap } from "../../../api/core/collections"
import { FRAME_HEIGHT } from "../../../globals"
import BaseTreeItem from "../../component/treeItems/BaseTreeItem"
import useSyncState from "../../hooks/useSyncState"
import {
    deleteTimelineExpandedUUID,
    addTimelineExpandedUUID
} from "../../../states/useTimelineExpandedUUIDs"
import {
    getTimelineLayer,
    setTimelineLayer
} from "../../../states/useTimelineLayer"
import getDisplayName from "../../utils/getDisplayName"
import handleTreeItemClick from "../../utils/handleTreeItemClick"

type LayerTreeItemProps = {
    children: ComponentChildren
    uuid: string
}

const LayerTreeItem = ({ children, uuid }: LayerTreeItemProps) => {
    const layer = useSyncState(getTimelineLayer)
    const [name, setName] = useState("")
    const instance = useMemo(() => uuidMap.get(uuid), [uuid])
    const selected = layer === uuid

    useLayoutEffect(() => {
        return () => {
            deleteTimelineExpandedUUID(uuid)
        }
    }, [])

    useLayoutEffect(() => {
        if (!instance) return
        setName(getDisplayName(instance))
        const handle = instance.propertyChangedEvent.on("name", () =>
            setName(getDisplayName(instance))
        )
        return () => {
            handle.cancel()
        }
    }, [instance])

    return (
        <BaseTreeItem
            height={FRAME_HEIGHT}
            label={name}
            onExpand={() => addTimelineExpandedUUID(uuid)}
            onCollapse={() => deleteTimelineExpandedUUID(uuid)}
            selected={selected}
            onClick={(e) => {
                setTimelineLayer(uuid)
                handleTreeItemClick(e, instance)
            }}
        >
            {children}
        </BaseTreeItem>
    )
}

export default LayerTreeItem
