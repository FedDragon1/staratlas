import Singleton from "@/utils/decorators/singleton";

interface Listener {
    onPress: () => void
    active: boolean
    onRaise?: () => void
}
type ListenerPool = Record<string, Listener>

class KeyboardListenerRaw {
    listeners: ListenerPool = {}

    listen(event: string, onPress: () => void, onRaise?: () => void) {
        this.listeners[event] = { onPress, onRaise, active: false }
        return this;
    }

    unlisten(event: string) {
        delete this.listeners[event]
        return this
    }

    protected onRaise(event: string) {
        const eventDesc = this.listeners[event]
        if (!eventDesc) {
            return;
        }

        eventDesc.active = false;
        if (eventDesc.onRaise) {
            eventDesc.onRaise()
        }
    }

    protected onPress(event: string) {
        const eventDesc = this.listeners[event]
        if (!eventDesc) {
            return
        }

        eventDesc.active = true;
        Object.values(this.listeners)
            .filter(listener => listener.active)
            .forEach(listener => listener.onPress())
    }

    protected keyDownListener = (e: KeyboardEvent) => this.onPress.call(this, e.code)
    protected keyUpListener = (e: KeyboardEvent) => this.onRaise.call(this, e.code)

    attachListeners() {
        document.addEventListener("keydown", this.keyDownListener)
        document.addEventListener("keyup", this.keyUpListener)
    }

    removeListeners() {
        document.removeEventListener("keydown", this.keyDownListener)
        document.removeEventListener("keyup", this.keyUpListener)
    }
}

export const KeyboardListener = Singleton(KeyboardListenerRaw)