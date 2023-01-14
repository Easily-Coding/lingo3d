import {
    distanceJointDefaults,
    distanceJointSchema
} from "../../interface/IDistanceJoint"
import { getPhysX } from "../../states/usePhysX"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"

const createDistance = (actor0: any, pose0: any, actor1: any, pose1: any) => {
    const { physics, Px } = getPhysX()
    const j = Px.DistanceJointCreate(physics, actor0, pose0, actor1, pose1)
    return j
}

export default class DistanceJoint extends JointBase {
    public static componentName = "distanceJoint"
    public static defaults = distanceJointDefaults
    public static schema = distanceJointSchema

    protected createJoint(
        fromPxTransform: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ) {
        return createDistance(
            fromManager.actor,
            fromPxTransform,
            toManager.actor,
            toPxTransform
        )
    }
}
