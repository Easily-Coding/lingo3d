import { distance3d, Point3d } from "@lincode/math"
import { Matrix3, Object3D, PropertyBinding } from "three"
import {
    frustum,
    matrix4,
    ray,
    vector3,
    vector3_1,
    vector3_half
} from "../../utils/reusables"
import { throttle } from "@lincode/utils"
import { OBB } from "three/examples/jsm/math/OBB"
import worldToClient from "../../utils/worldToClient"
import { Cancellable } from "@lincode/promiselikes"
import { point2Vec, vec2Point } from "../../utils/vec2Point"
import { LingoMouseEvent } from "../../../interface/IMouse"
import getCenter from "../../utils/getCenter"
import IStaticObjectManager from "../../../interface/IStaticObjectManager"
import MeshManager, { isMeshManager } from "../MeshManager"
import { getCameraRendered } from "../../../states/useCameraRendered"
import { onBeforeRender } from "../../../events/onBeforeRender"
import getWorldPosition from "../../utils/getWorldPosition"
import getWorldDirection from "../../utils/getWorldDirection"
import {
    clickSet,
    mouseDownSet,
    mouseUpSet,
    mouseOverSet,
    mouseOutSet,
    mouseMoveSet
} from "./raycast/sets"
import "./raycast"
import fpsAlpha from "../../utils/fpsAlpha"
import { emitId } from "../../../events/onId"
import { emitName } from "../../../events/onName"
import { CM2M, M2CM } from "../../../globals"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { uuidMap } from "../../../api/core/collections"
import { forceGetInstance } from "../../../utils/forceGetInstance"

const thisOBB = new OBB()
const targetOBB = new OBB()

const updateFrustum = throttle(
    () => {
        const camera = getCameraRendered()
        frustum.setFromProjectionMatrix(
            matrix4.multiplyMatrices(
                camera.projectionMatrix,
                camera.matrixWorldInverse
            )
        )
    },
    200,
    "leading"
)

export const idMap = new Map<string, Set<StaticObjectManager>>()

const allocateSet = (id: string) => {
    const found = uuidMap.get(id)
    if (isMeshManager(found)) return new Set([found])
    return forceGetInstance(idMap, id, Set<StaticObjectManager>)
}

export const getMeshManagerSets = (
    id: string | Array<string> | MeshManager
) => {
    const targetSets: Array<Set<MeshManager>> = []
    if (Array.isArray(id))
        for (const target of id) targetSets.push(allocateSet(target))
    else if (typeof id === "string") targetSets.push(allocateSet(id))
    else targetSets.push(new Set([id]))

    return targetSets
}

export default class StaticObjectManager<T extends Object3D = Object3D>
    extends MeshAppendable<T>
    implements IStaticObjectManager
{
    public override dispose() {
        if (this.done) return this
        super.dispose()
        this._id !== undefined && idMap.get(this._id)!.delete(this)
        return this
    }

    protected _id?: string
    public get id() {
        return this._id
    }
    public set id(val) {
        this._id !== undefined && idMap.get(this._id)!.delete(this)
        this._id = val
        if (val === undefined) return
        allocateSet(val).add(this)
        emitId(val)
    }

    protected addToRaycastSet(set: Set<Object3D>) {
        set.add(this.object3d)
        return new Cancellable(() => set.delete(this.object3d))
    }

    private _onClick?: (e: LingoMouseEvent) => void
    public get onClick() {
        return this._onClick
    }
    public set onClick(cb) {
        this._onClick = cb
        this.cancelHandle(
            "onClick",
            cb && (() => this.addToRaycastSet(clickSet))
        )
    }

    private _onMouseDown?: (e: LingoMouseEvent) => void
    public get onMouseDown() {
        return this._onMouseDown
    }
    public set onMouseDown(cb) {
        this._onMouseDown = cb
        this.cancelHandle(
            "onMouseDown",
            cb && (() => this.addToRaycastSet(mouseDownSet))
        )
    }

    private _onMouseUp?: (e: LingoMouseEvent) => void
    public get onMouseUp() {
        return this._onMouseUp
    }
    public set onMouseUp(cb) {
        this._onMouseUp = cb
        this.cancelHandle(
            "onMouseUp",
            cb && (() => this.addToRaycastSet(mouseUpSet))
        )
    }

    private _onMouseOver?: (e: LingoMouseEvent) => void
    public get onMouseOver() {
        return this._onMouseOver
    }
    public set onMouseOver(cb) {
        this._onMouseOver = cb
        this.cancelHandle(
            "onMouseOver",
            cb && (() => this.addToRaycastSet(mouseOverSet))
        )
    }

    private _onMouseOut?: (e: LingoMouseEvent) => void
    public get onMouseOut() {
        return this._onMouseOut
    }
    public set onMouseOut(cb) {
        this._onMouseOut = cb
        this.cancelHandle(
            "onMouseOut",
            cb && (() => this.addToRaycastSet(mouseOutSet))
        )
    }

    private _onMouseMove?: (e: LingoMouseEvent) => void
    public get onMouseMove() {
        return this._onMouseMove
    }
    public set onMouseMove(cb) {
        this._onMouseMove = cb
        this.cancelHandle(
            "onMouseMove",
            cb && (() => this.addToRaycastSet(mouseMoveSet))
        )
    }

    public get name() {
        return this.outerObject3d.name
    }
    public set name(val) {
        this.outerObject3d.name = PropertyBinding.sanitizeNodeName(val)
        emitName(this)
    }

    protected getRay() {
        return ray.set(
            getWorldPosition(this.object3d),
            getWorldDirection(this.object3d)
        )
    }

    public pointAt(distance: number) {
        return vec2Point(this.getRay().at(distance * CM2M, vector3))
    }

    public rayIntersectsAt(target: StaticObjectManager, maxDistance?: number) {
        if (this.done) return undefined
        if (target.done) return undefined
        if (this === target) return undefined

        targetOBB.set(
            getWorldPosition(target.object3d),
            vector3_half,
            new Matrix3().setFromMatrix4(target.object3d.matrixWorld)
        )

        const vec = targetOBB.intersectRay(this.getRay(), vector3)
        if (!vec) return

        if (maxDistance) {
            const { x, y, z } = getWorldPosition(this.object3d)
            if (distance3d(vec.x, vec.y, vec.z, x, y, z) * M2CM > maxDistance)
                return
        }
        return vec2Point(vec)
    }

    public rayIntersects(target: StaticObjectManager) {
        return !!this.rayIntersectsAt(target)
    }

    public intersects(target: StaticObjectManager) {
        if (this.done) return false
        if (target.done) return false
        if (this === target) return false

        thisOBB.set(
            getWorldPosition(this.object3d),
            vector3_1.clone(),
            new Matrix3()
        )
        thisOBB.applyMatrix4(this.object3d.matrixWorld)

        targetOBB.set(
            getWorldPosition(target.object3d),
            vector3_1.clone(),
            new Matrix3()
        )
        targetOBB.applyMatrix4(target.object3d.matrixWorld)

        return thisOBB.intersectsOBB(targetOBB, 0)
    }

    public get clientX() {
        return worldToClient(this.object3d).x
    }

    public get clientY() {
        return worldToClient(this.object3d).y
    }

    public get frustumVisible() {
        updateFrustum()
        return frustum.containsPoint(getCenter(this.object3d))
    }

    public lookAt(target: MeshManager | Point3d): void
    public lookAt(x: number, y: number | undefined, z: number): void
    public lookAt(
        a0: MeshManager | Point3d | number,
        a1?: number,
        a2?: number
    ) {
        if (typeof a0 === "number") {
            this.lookAt(
                new Point3d(
                    a0,
                    a1 === undefined ? this.position.y * M2CM : a1,
                    a2!
                )
            )
            return
        }
        if ("outerObject3d" in a0)
            this.outerObject3d.lookAt(getWorldPosition(a0.object3d))
        else this.outerObject3d.lookAt(point2Vec(a0))
    }

    public onLookToEnd: (() => void) | undefined

    public lookTo(target: MeshManager | Point3d, alpha: number): void
    public lookTo(
        x: number,
        y: number | undefined,
        z: number,
        alpha: number
    ): void
    public lookTo(
        a0: MeshManager | Point3d | number,
        a1: number | undefined,
        a2?: number,
        a3?: number
    ) {
        if (typeof a0 === "number") {
            this.lookTo(
                new Point3d(
                    a0,
                    a1 === undefined ? this.position.y * M2CM : a1,
                    a2!
                ),
                a3!
            )
            return
        }
        const { quaternion } = this.outerObject3d
        const quaternionOld = quaternion.clone()
        this.lookAt(a0)
        const quaternionNew = quaternion.clone()

        quaternion.copy(quaternionOld)

        this.cancelHandle("lookTo", () =>
            onBeforeRender(() => {
                quaternion.slerp(quaternionNew, fpsAlpha(a1!))

                const x = Math.abs(quaternion.x - quaternionNew.x)
                const y = Math.abs(quaternion.y - quaternionNew.y)
                const z = Math.abs(quaternion.z - quaternionNew.z)
                const w = Math.abs(quaternion.w - quaternionNew.w)
                if (x + y + z + w < 0.001) {
                    this.cancelHandle("lookTo", undefined)
                    this.onLookToEnd?.()

                    quaternion.copy(quaternionNew)
                }
            })
        )
    }

    public getWorldPosition(): Point3d {
        return vec2Point(getWorldPosition(this.object3d))
    }

    public getWorldDirection(): Point3d {
        return getWorldDirection(this.object3d)
    }
}
