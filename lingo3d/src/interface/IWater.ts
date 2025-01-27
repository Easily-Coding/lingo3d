import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import Nullable from "./utils/Nullable"

export default interface IWater extends IVisibleObjectManager {
    shape: "plane" | "sphere"
    normalMap: Nullable<string>
    resolution: number
    speed: number
}

export const waterSchema: Required<ExtractProps<IWater>> = {
    ...visibleObjectManagerSchema,
    shape: String,
    normalMap: String,
    resolution: Number,
    speed: Number
}

export const waterDefaults = extendDefaults<IWater>(
    [visibleObjectManagerDefaults],
    {
        shape: "plane",
        normalMap: undefined,
        resolution: 512,
        speed: 1,
        rotationX: 270,
        scaleZ: 0,
        depth: 0
    },
    {
        resolution: new Range(256, 2048, 256)
    },
    { normalMap: true }
)
