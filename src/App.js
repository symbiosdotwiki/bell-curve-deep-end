import { Suspense, useRef, useEffect } from "react"

import * as THREE from "three"
import { Canvas, useLoader } from '@react-three/fiber'
import { SoftShadows } from "@react-three/drei"
import { EffectComposer, DepthOfField, Bloom } from '@react-three/postprocessing'

// import { Environment, useTexture } from '@react-three/drei'
import ReactPlayer from 'react-player/soundcloud'

import { useStore } from './state'
import Scene from './Scene'
import Balloons from './Balloons'

import logo from './logo.svg'
import './App.css'

function Loading() {
  return (
    <div className="LOADING">
      LOADING
    </div>
  )
}

function App() {
  const scRef = useRef()
  const curTrack = useStore((state) => state.curTrack)
  const curTarget = useStore((state) => state.curTarget)

  
  let dofTarget = new THREE.Vector3()
  if(curTarget)
    dofTarget = curTarget.position

  if(curTrack && scRef.current)
    scRef.current.getInternalPlayer().skip(curTrack)

  useEffect(() => {
    const handleKeyUp = (e) => {
      // console.log(e.code)
      if(e.code==='Space')
        scRef.current.getInternalPlayer().toggle()
    }
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <div className="App">
      <header> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> </header>
      <ReactPlayer 
        className='sc-player'
        url='https://soundcloud.com/isaka_symbios_wiki/sets/traxxx' 
        width={'100%'}
        height={'10%'}
        ref={scRef}
        config={{
          playing:true,
          soundcloud:{
            options:{
              start_track:curTrack
            }
          }
        }}
      />
      <Suspense fallback={<Loading/>}>
        <div className="THREE">
          <Canvas 
            shadows 
            onPointerMissed={(e)=>{
              useStore.setState({ 
                cam: null,
              })
            }}
          >
            <Scene
              // resetCam={() => resetCam()}
              // portrait={dimensions.portrait}
            />
            <Balloons
              // resetCam={() => resetCam()}
              // portrait={dimensions.portrait}
            />
            <SoftShadows size={10} samples={10} />
            <EffectComposer multisampling={0}>
              <DepthOfField target={dofTarget} focalLength={0.002} bokehScale={8} height={1024} />
              <Bloom luminanceThreshold={.5} mipmapBlur luminanceSmoothing={0.0} intensity={.5} />
            </EffectComposer>
          </Canvas>
        </div>
      </Suspense>
    </div>
  )
}

export default App
