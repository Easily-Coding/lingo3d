import { Point } from "@lincode/math"
import { pt0 } from "../display/utils/reusables"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { nullableCallback } from "./utils/NullableCallback"

export default interface IJoystick extends IAppendable {
    onMove: Nullable<(e: Point) => void>
    onMoveStart: Nullable<(e: Point) => void>
    onMoveEnd: Nullable<(e: Point) => void>
    onPress: Nullable<(e: Point) => void>
}

export const joystickSchema: Required<ExtractProps<IJoystick>> = {
    ...appendableSchema,
    onMove: Function,
    onMoveStart: Function,
    onMoveEnd: Function,
    onPress: Function
}

export const joystickDefaults = extendDefaults<IJoystick>(
    [appendableDefaults],
    {
        onMove: nullableCallback(pt0),
        onMoveStart: nullableCallback(pt0),
        onMoveEnd: nullableCallback(pt0),
        onPress: nullableCallback(pt0)
    }
)
