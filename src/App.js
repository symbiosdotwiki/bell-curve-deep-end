import { Suspense, useEffect } from "react"

import { Canvas, useLoader } from '@react-three/fiber'
import { useStore, scURL } from './state'

import { 
  Selection
} from '@react-three/postprocessing'

import Scene from './Scene'
import Balloons from './Balloons'
import Cam from './Cam'
import PostProcessing from './PostProcessing'
import SC from './SC'

import { glCheck, mobileAndTabletCheck } from './helpers'

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

  const glInfo = glCheck()
  const isMobile = mobileAndTabletCheck()

  const hasGL = glInfo.error ? false : true
  const hdState = glInfo.card === null || isMobile ? false : true
  const pixRat = hdState ? 1 : .5

  // console.log('RERENDER: APP')

  return (
    <div className="App">
      <header> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> </header>
      
      <SC/>

      <Suspense fallback={<Loading/>}>
        <div className="THREE" 
          // style={{ 
              // width: "50vw", height: "50vh",
              // transform: 'scale(3)',
              // transformOrigin: 'top left'
          // }}
        >
          <Canvas 
            shadows
            dpr={window.devicePixelRatio*pixRat}
            onPointerMissed={(e)=>{
              // console.log('POINTER MISSED')
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
              <Balloons
                // resetCam={() => resetCam()}
                // portrait={dimensions.portrait}
              />
              <Cam/>
              <PostProcessing/>
            </Selection>
          </Canvas>
        </div>
      </Suspense>
    </div>
  )
}

export default App
