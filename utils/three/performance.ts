import Stats from "stats.js"

class PerformanceStats {
    stats?: Stats

    init() {
        this.stats = new Stats()
        this.stats.dom.style.top = "auto"
        this.stats.dom.style.bottom = "0"
        document.body.appendChild(this.stats.dom)
    }

    update() {
        this.stats?.update()
    }
}

export const performanceStats = new PerformanceStats()