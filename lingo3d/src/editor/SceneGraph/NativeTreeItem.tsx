import { useEffect, useMemo, useState } from "preact/hooks"
import { Object3D } from "three"
import { makeTreeItemCallbacks, TreeItemProps } from "./TreeItem"
import { useSceneGraphExpanded, useSelectionNativeTarget } from "../states"
import ComponentIcon from "./icons/ComponentIcon"
import BaseTreeItem from "../component/BaseTreeItem"

type NativeTreeItemProps = TreeItemProps & {
    object3d: Object3D
}

const NativeTreeItem = ({ appendable, object3d }: NativeTreeItemProps) => {
    const [expanded, setExpanded] = useState(false)
    const [nativeTarget] = useSelectionNativeTarget()

    const handleClick = useMemo(
        () => makeTreeItemCallbacks(object3d, appendable),
        []
    )

    const [sceneGraphExpanded, setSceneGraphExpanded] = useSceneGraphExpanded()
    useEffect(() => {
        sceneGraphExpanded?.has(object3d) && setExpanded(true)
    }, [sceneGraphExpanded])

    const selected = nativeTarget === object3d

    return (
        <BaseTreeItem
            label={object3d.name}
            selected={selected}
            onCollapse={() => setSceneGraphExpanded(undefined)}
            onClick={handleClick}
            expanded={expanded}
            expandable={!!object3d.children.length}
            outlined
            IconComponent={ComponentIcon}
        >
            {() =>
                object3d.children.map((child) => (
                    <NativeTreeItem
                        key={child.uuid}
                        object3d={child}
                        appendable={appendable}
                    />
                ))
            }
        </BaseTreeItem>
    )
}

export default NativeTreeItem