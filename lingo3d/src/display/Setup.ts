import EventLoopItem from "../api/core/EventLoopItem"
import ISetup, { setupDefaults, setupSchema } from "../interface/ISetup"
import {
    pullSetupStack,
    pushSetupStack,
    refreshSetupStack
} from "../states/useSetupStack"

//@ts-ignore
export default class Setup extends EventLoopItem implements ISetup {
    public static componentName = "setup"
    public static defaults = setupDefaults
    public static schema = setupSchema

    public constructor() {
        super()
        pushSetupStack(this)
        this.then(() => pullSetupStack(this))
    }
}
for (const key of Object.keys(setupSchema)) {
    Object.defineProperty(Setup.prototype, key, {
        get() {
            return this["_" + key]
        },
        set(value) {
            this["_" + key] = value
            refreshSetupStack()
        }
    })
}
