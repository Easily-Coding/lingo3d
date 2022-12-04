import { last, omit } from "@lincode/utils"
import { useLayoutEffect } from "preact/hooks"
import { FolderApi, Pane } from "../TweakPane/tweakpane"
import mainCamera from "../../engine/mainCamera"
import {
    getSecondaryCamera,
    setSecondaryCamera
} from "../../states/useSecondaryCamera"
import getComponentName from "../utils/getComponentName"
import useSyncState from "../hooks/useSyncState"
import { getCameraList } from "../../states/useCameraList"
import { getCameraStack } from "../../states/useCameraStack"

export default (pane?: Pane, cameraFolder?: FolderApi) => {
    const cameraStack = useSyncState(getCameraStack)
    const camera = last(cameraStack)!
    const cameraList = useSyncState(getCameraList)

    useLayoutEffect(() => {
        if (!pane || !cameraFolder) return

        const mainCameraName = "editor camera"

        const options = cameraList.reduce<Record<string, any>>(
            (acc, cam, i) => {
                acc[
                    i === 0
                        ? mainCameraName
                        : getComponentName(cam.userData.manager)
                ] = i
                return acc
            },
            {}
        )
        const cameraInput = pane.addInput(
            { camera: cameraList.indexOf(camera) },
            "camera",
            { options }
        )
        cameraFolder.add(cameraInput)
        cameraInput.on("change", ({ value }: any) => {
            cameraList[value].userData.manager.active = true
        })

        const secondaryCameraInput = pane.addInput(
            {
                "secondary camera": cameraList.indexOf(
                    getSecondaryCamera() ?? mainCamera
                )
            },
            "secondary camera",
            {
                options: {
                    none: 0,
                    ...omit(options, mainCameraName)
                }
            }
        )
        cameraFolder.add(secondaryCameraInput)
        secondaryCameraInput.on("change", ({ value }: any) =>
            setSecondaryCamera(value === 0 ? undefined : cameraList[value])
        )

        return () => {
            cameraInput.dispose()
            secondaryCameraInput.dispose()
        }
    }, [pane, cameraFolder, cameraList, camera])
}
