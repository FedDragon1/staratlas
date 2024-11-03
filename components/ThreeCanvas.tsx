"use client"

import { FC, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { Environment } from "@/utils/three/environment";

interface Props {
    init: (environment: Environment) => void;
    constructor: typeof Environment
    onDestroy?: () => void;
    style?: ReturnType<typeof css>
}

const ThreeCanvas: FC<Props> = ({ init, constructor, style, onDestroy }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // TODO: ugly as fuck
    useEffect(() => {
        if (!canvasRef.current) {
            return
        }

        const developmentHelper = new constructor({
            antialias: true,
            canvas: canvasRef.current
        });
        init(developmentHelper)
        developmentHelper.attachResizeListener()

        return () => {
            if (onDestroy) {
                onDestroy()
            }
        }
    }, [onDestroy, init, constructor])

    return (
        <Container css={style}>
            <CanvasWrap>
                <canvas ref={canvasRef} />
            </CanvasWrap>
        </Container>
    )
}

const CanvasWrap = styled.div`
    width: 100%;
    height: 100%;
`

const Container = styled.div<{ css?: ReturnType<typeof css> }>`
    height: 100vh;
    width: 100vw;
    ${(props) => props.css}
`

export default ThreeCanvas