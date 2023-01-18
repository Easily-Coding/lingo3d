import { deg2Rad } from "@lincode/math"
import { CM2M } from "../../globals"
import ID6Joint, {
    d6JointDefaults,
    d6JointSchema,
    D6MotionOptions
} from "../../interface/ID6Joint"
import debounceSystem from "../../utils/debounceSystem"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"
import destroy from "../core/PhysicsObjectManager/physx/destroy"
import { physxPtr } from "../core/PhysicsObjectManager/physx/physxPtr"

const createD6 = (actor0: any, pose0: any, actor1: any, pose1: any) => {
    const { physics, Px } = physxPtr[0]
    return Px.D6JointCreate(physics, actor0, pose0, actor1, pose1)
}

const getMotion = (val: D6MotionOptions) => {
    const { PxD6MotionEnum } = physxPtr[0]
    switch (val) {
        case "locked":
            return PxD6MotionEnum.eLOCKED()
        case "limited":
            return PxD6MotionEnum.eLIMITED()
        case "free":
            return PxD6MotionEnum.eFREE()
        default:
            return PxD6MotionEnum.eFREE()
    }
}

const configJointSystem = debounceSystem((target: D6Joint) => {
    const { pxJoint } = target
    if (!pxJoint) return

    const {
        PxD6AxisEnum,
        PxJointLimitCone,
        PxJointAngularLimitPair,
        PxJointLinearLimitPair
    } = physxPtr[0]
    const {
        linearX,
        linearY,
        linearZ,
        linearLimitX,
        linearLimitY,
        linearLimitZ,
        swingY,
        swingZ,
        twist,
        twistLimitLow,
        twistLimitHigh,
        swingLimitY,
        swingLimitZ
    } = target

    pxJoint.setMotion(PxD6AxisEnum.eX(), getMotion(linearX))
    pxJoint.setMotion(PxD6AxisEnum.eY(), getMotion(linearY))
    pxJoint.setMotion(PxD6AxisEnum.eZ(), getMotion(linearZ))

    if (linearX === "limited") {
        const val = linearLimitX * CM2M
        const linearLimit = new PxJointLinearLimitPair(-val, val)
        pxJoint.setLinearLimit(PxD6AxisEnum.eX(), linearLimit)
        destroy(linearLimit)
    }
    if (linearY === "limited") {
        const val = linearLimitY * CM2M
        const linearLimit = new PxJointLinearLimitPair(-val, val)
        pxJoint.setLinearLimit(PxD6AxisEnum.eY(), linearLimit)
        destroy(linearLimit)
    }
    if (linearZ === "limited") {
        const val = linearLimitZ * CM2M
        const linearLimit = new PxJointLinearLimitPair(-val, val)
        pxJoint.setLinearLimit(PxD6AxisEnum.eZ(), linearLimit)
        destroy(linearLimit)
    }

    pxJoint.setMotion(PxD6AxisEnum.eSWING1(), getMotion(swingY))
    pxJoint.setMotion(PxD6AxisEnum.eSWING2(), getMotion(swingZ))
    pxJoint.setMotion(PxD6AxisEnum.eTWIST(), getMotion(twist))

    if (swingY === "limited" || swingZ === "limited") {
        const limitCone = new PxJointLimitCone(
            swingLimitY * deg2Rad,
            swingLimitZ * deg2Rad
        )
        pxJoint.setSwingLimit(limitCone)
        destroy(limitCone)
    }
    if (twist === "limited") {
        const limitPair = new PxJointAngularLimitPair(
            twistLimitLow * deg2Rad,
            twistLimitHigh * deg2Rad
        )
        pxJoint.setTwistLimit(limitPair)
        destroy(limitPair)
    }
})

export default class D6Joint extends JointBase implements ID6Joint {
    public static componentName = "d6Joint"
    public static defaults = d6JointDefaults
    public static schema = d6JointSchema

    protected createJoint(
        fromPxTransform: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ) {
        configJointSystem(this)
        return createD6(
            fromManager.actor,
            fromPxTransform,
            toManager.actor,
            toPxTransform
        )
    }

    private _linearX?: D6MotionOptions
    public get linearX() {
        return this._linearX ?? "locked"
    }
    public set linearX(val) {
        this._linearX = val
        configJointSystem(this)
    }

    private _linearLimitX?: number
    public get linearLimitX() {
        return this._linearLimitX ?? 100
    }
    public set linearLimitX(val) {
        this._linearLimitX = val
        configJointSystem(this)
    }

    private _linearY?: D6MotionOptions
    public get linearY() {
        return this._linearY ?? "locked"
    }
    public set linearY(val) {
        this._linearY = val
        configJointSystem(this)
    }

    private _linearLimitY?: number
    public get linearLimitY() {
        return this._linearLimitY ?? 100
    }
    public set linearLimitY(val) {
        this._linearLimitY = val
        configJointSystem(this)
    }

    private _linearZ?: D6MotionOptions
    public get linearZ() {
        return this._linearZ ?? "locked"
    }
    public set linearZ(val) {
        this._linearZ = val
        configJointSystem(this)
    }

    private _linearLimitZ?: number
    public get linearLimitZ() {
        return this._linearLimitZ ?? 100
    }
    public set linearLimitZ(val) {
        this._linearLimitZ = val
        configJointSystem(this)
    }

    private _swingY?: D6MotionOptions
    public get swingY() {
        return this._swingY ?? "locked"
    }
    public set swingY(val) {
        this._swingY = val
        configJointSystem(this)
    }

    private _swingZ?: D6MotionOptions
    public get swingZ() {
        return this._swingZ ?? "locked"
    }
    public set swingZ(val) {
        this._swingZ = val
        configJointSystem(this)
    }

    private _twist?: D6MotionOptions
    public get twist() {
        return this._twist ?? "locked"
    }
    public set twist(val) {
        this._twist = val
        configJointSystem(this)
    }

    private _twistLimitLow?: number
    public get twistLimitLow() {
        return this._twistLimitLow ?? -360
    }
    public set twistLimitLow(val) {
        this._twistLimitLow = val
        configJointSystem(this)
    }

    private _twistLimitHigh?: number
    public get twistLimitHigh() {
        return this._twistLimitHigh ?? 360
    }
    public set twistLimitHigh(val) {
        this._twistLimitHigh = val
        configJointSystem(this)
    }

    private _swingLimitY?: number
    public get swingLimitY() {
        return this._swingLimitY ?? 360
    }
    public set swingLimitY(val) {
        this._swingLimitY = val
        configJointSystem(this)
    }

    private _swingLimitZ?: number
    public get swingLimitZ() {
        return this._swingLimitZ ?? 360
    }
    public set swingLimitZ(val) {
        this._swingLimitZ = val
        configJointSystem(this)
    }
}