import PhysicsObjectManager from "../.."
import getActualScale from "../../../../utils/getActualScale"
import loadCannon from "../loadCannon"

export default async function (this: PhysicsObjectManager) {
    const { Cylinder } = await loadCannon()
    const { x, y } = getActualScale(this)
    const radius = x * 0.5
    const shape = new Cylinder(radius, radius, y)
    this.cannonBody!.addShape(shape)
}