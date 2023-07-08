import { Suspense, useRef } from "react"
import { Canvas, useLoader } from '@react-three/fiber'
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

  

  if(curTrack && scRef.current)
    scRef.current.getInternalPlayer().skip(curTrack)

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
          <Canvas shadows={false}>
            <Scene
              // resetCam={() => resetCam()}
              // portrait={dimensions.portrait}
            />
            <Balloons
              // resetCam={() => resetCam()}
              // portrait={dimensions.portrait}
            />
            
          </Canvas>
        </div>
      </Suspense>
    </div>
  )
}

export default App
