// Singleton support for typescript

type Constructor = new (...args: any[]) => object;

const Singleton = <T extends Constructor>(constructor: T) => {
    let instance: R | null = null

    class R extends constructor {
        constructor(...args: any[]) {
            if (instance) {
                return instance
            }
            super(...args)
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            instance = this
        }
    }

    return R
}

export default Singleton
