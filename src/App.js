import { Suspense, useRef, useEffect } from "react"

import * as THREE from "three"
import { Canvas, useLoader } from '@react-three/fiber'
import { SoftShadows, Stats } from "@react-three/drei"
import { 
  EffectComposer, DepthOfField, Bloom, Selection, Outline, SSAO
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'


// import { Environment, useTexture } from '@react-three/drei'
import ReactPlayer from 'react-player/soundcloud'

import { useStore, scURL } from './state'
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

  
  let dofTarget = new THREE.Vector3(0,1.5,0)
  if(curTarget)
    dofTarget = curTarget.position

  if(curTrack != null && scRef.current){
    // console.log('hi', curTrack)
    // console.log(scRef.current, scRef.current.getInternalPlayer())
    scRef.current.getInternalPlayer().skip(curTrack)
  }

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
        url={scURL} 
        width={'100%'}
        height={'10%'}
        ref={scRef}
        config={{
          playing:true,
          soundcloud:{
            options:{
              start_track:curTrack,
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
          <Selection>
            <Scene
              // resetCam={() => resetCam()}
              // portrait={dimensions.portrait}
            />

            <SoftShadows size={10} samples={5} />

            <EffectComposer multisampling={0} autoClear={false}>
              <DepthOfField 
                target={dofTarget} 
                focalLength={0.002} 
                bokehScale={8} 
                height={512} 
              />
              <Bloom luminanceThreshold={.5} mipmapBlur luminanceSmoothing={0.0} intensity={.5} />
              <Outline 
                visibleEdgeColor="yellow" 
                hiddenEdgeColor="yellow" 
                blur 
                width={512} 
                edgeStrength={4} 
                blendFunction={BlendFunction.ALPHA}
                pulseSpeed={.2}
              />
              {/*<SSAO
                blendFunction={BlendFunction.MULTIPLY} // Use NORMAL to see the effect
                samples={31}
                radius={.5}
                intensity={60}
              />*/}
            </EffectComposer>

              <Balloons
                // resetCam={() => resetCam()}
                // portrait={dimensions.portrait}
              />
            </Selection>

            <Stats />
            <fog attach="fog" args={[`hsl(205, 100%, 80%)`, .5, 5]} density={.15} />
          </Canvas>
        </div>
      </Suspense>
    </div>
  )
}

export default App
