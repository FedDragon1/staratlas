"use client"

import { FC } from "react";
import { NextSEO } from "@/components/NextSEO";
import styled from "styled-components"
import ThreeCanvas from "@/components/ThreeCanvas";
import { DevelopmentEnvironment, Environment } from "@/utils/three/environment";
import { Planet } from "@/components/models/planet";
import { ModelLoader } from "@/utils/three/modelLoader";

type HomeProps = object

const destroyHooks: (() => void)[] = []

const Home: FC<HomeProps> = () => {
    return (
        <>
            <Container>
                <NextSEO></NextSEO>
                <ThreeCanvas init={init} constructor={DevelopmentEnvironment} onDestroy={() => destroyHooks.forEach(hook => hook())} />
            </Container>
            <div id="page-container" className="h-[1000vh] w-full" />
        </>
    )
}

function init(environment: Environment) {
    environment.initialize()
    environment.setBackground("#e2d6c8")

    const modelLoader = new ModelLoader()

    new Planet(modelLoader, environment)
}

const Container = styled.main`
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background: black;
`

export default Home
