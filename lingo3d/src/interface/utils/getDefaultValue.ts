import Appendable from "../../api/core/Appendable"
import unsafeGetValue from "../../utils/unsafeGetValue"
import DefaultMethod from "./DefaultMethod"
import Defaults from "./Defaults"
import NullableCallback from "./NullableCallback"
import NullableDefault from "./NullableDefault"

export type FunctionPtr = [
    NullableCallback<any> | DefaultMethod<any> | undefined
]

const getDefaultValue = (
    manager: Appendable | Defaults<any>,
    key: string,
    fillNullableDefault?: boolean,
    fillFunctionArgs?: boolean,
    functionPtr?: FunctionPtr
) => {
    const constructorDefaults = unsafeGetValue(manager.constructor, "defaults")
    const runtimeManager = constructorDefaults ? manager : undefined
    if (
        runtimeManager?.runtimeDefaults &&
        key in runtimeManager.runtimeDefaults
    )
        return runtimeManager.runtimeDefaults[key]

    const result = (constructorDefaults ?? manager)[key]
    if (result instanceof NullableDefault)
        return fillNullableDefault ? result.value : undefined
    if (result instanceof NullableCallback) {
        if (functionPtr) functionPtr[0] = result
        return fillFunctionArgs ? result.param : undefined
    }
    if (result instanceof DefaultMethod) {
        if (functionPtr) functionPtr[0] = result
        return fillFunctionArgs ? result.arg : undefined
    }
    if (fillNullableDefault) return result ?? ""
    return result
}
export default getDefaultValue

const isEqual = (val0: any, val1: any) =>
    val0 === val1 ||
    (typeof val0 === typeof val1 &&
        JSON.stringify(val0) === JSON.stringify(val1))

export const equalsValue = (
    manager: Appendable | Defaults<any>,
    val0: any,
    val1: any,
    key: string
) => {
    const defaultValue = getDefaultValue(manager, key, true, false)
    return isEqual(val0 ?? defaultValue, val1 ?? defaultValue)
}

export const equalsDefaultValue = (
    val: any,
    manager: Appendable | Defaults<any>,
    key: string
) => {
    const defaultValue = getDefaultValue(manager, key, true, false)
    return isEqual(val ?? defaultValue, defaultValue)
}
