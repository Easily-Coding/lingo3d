import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import ITimelineAudio, {
    timelineAudioDefaults,
    timelineAudioSchema
} from "../interface/ITimelineAudio"

export default class TimelineAudio
    extends Appendable
    implements ITimelineAudio
{
    public static componentName = "timelineAudio"
    public static defaults = timelineAudioDefaults
    public static schema = timelineAudioSchema

    private audio = new Audio()

    public constructor() {
        super()
        this.audio.ondurationchange = () =>
            this.durationState.set(this.audio.duration)
    }

    public srcState = new Reactive<string | undefined>(undefined)
    public get src() {
        return this.srcState.get()
    }
    public set src(value) {
        this.srcState.set(value)
        this.audio.src = value ?? ""
        this.durationState.set(0)
    }

    public durationState = new Reactive(0)
    public get duration() {
        return this.durationState.get()
    }
}
