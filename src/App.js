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
  const nextCam = useStore((state) => state.nextCam)
  const nextTarget = useStore((state) => state.nextTarget)
  const dofTarget = useStore((state) => state.dofTarget)

  if(curTrack != null && scRef.current){
    // console.log('hi', curTrack)
    // console.log(scRef.current, scRef.current.getInternalPlayer())
    scRef.current.getInternalPlayer().getCurrentSoundIndex((e)=>{
      if(e != curTrack){
        scRef.current.getInternalPlayer().skip(curTrack)
        // scRef.current.getInternalPlayer().seekTo(160000)
      }
    })
  }

  useEffect(() => {
    const handleKeyUp = (e) => {
      // console.log(e.code)
      if(e.code==='Space')
        scRef.current.getInternalPlayer().toggle()
    }
    const setNextTrack = (e) => {
      console.log(e)
    }
    document.addEventListener('keyup', handleKeyUp)
    // scRef.current.getInternalPlayer().bind(SC.Widget.Events.FINISH, setNextTrack)
    return () => {
      document.removeEventListener('keyup', handleKeyUp)
      // scRef.current.getInternalPlayer().unbind(SC.Widget.Events.FINISH, setNextTrack)
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
        onPlay={() => {
          // console.log("PLAY")
        }}
        onProgress={(e) => {
          scRef.current.getInternalPlayer().getCurrentSoundIndex((e)=>{
            if(e != curTrack){
              // console.log(e)
              useStore.setState({ 
                curTrack: e,
                cam: nextCam,
                curTarget: nextTarget,
                // nextTarget: nextTarget,
                // nextCam: nextCam
                // dofTarget: p
              })
            }
            // useStore.setState({ 
            //   curTrack: trackNum,
            //   cam: camRef.current,
            //   curTarget: geoRef.current
            // })
          })
          // console.log(e)
        }}
        onEnded={(e) => {"FINISH"}}
        config={{
          playing:true,
          soundcloud:{
            options:{
              start_track:curTrack,
              auto_play:false
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
              <Bloom luminanceThreshold={.5} mipmapBlur luminanceSmoothing={0.0} intensity={.35} />
              <Bloom luminanceThreshold={.75} mipmapBlur luminanceSmoothing={0.0} intensity={1} />
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
            <fog attach="fog" args={[`hsl(195, 69%, 48%)`, .5, 5]} density={.15} />
          </Canvas>
        </div>
      </Suspense>
    </div>
  )
}

export default App
