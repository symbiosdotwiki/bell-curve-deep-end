import { Suspense, useEffect, useRef } from "react"

import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { useStore, scURL } from './state'

import { useDrag } from 'react-use-gesture'

import { 
  Selection
} from '@react-three/postprocessing'

import Scene from './Scene'
import Balloons from './Balloons'
import Cam from './Cam'
import PostProcessing from './PostProcessing'
import SC from './SC'
import InfoPanel from './InfoPanel'
import FrameLimiter from './FrameLimiter'

import { glCheck, mobileAndTabletCheck } from './helpers'

import './App.css'
import './Info.css'

const mainLogo = process.env.PUBLIC_URL + '/bellcurve.png'


function Loading() {
  return (
    <div className="LOADING">
      {/*LOADING*/}
    <img  src={mainLogo} />
    </div>
  )
}

function App() {
  const scRef = useRef()

  const glInfo = glCheck()
  const isMobile = mobileAndTabletCheck()

  const hasGL = glInfo.error ? false : true
  const hdState = glInfo.card === null || isMobile ? false : true
  const pixRat = hdState ? 1 : isMobile ? .33333 : .5
  const frameCap = 60//isMobile ? 30 : 60

  const bind = useDrag(
    ({down, movement: [x, y], event }) => {
      const moved = Math.sqrt(x*x + y*y)
      useStore.setState({
        drag: [
          x, 
          -y, 
          moved > 1 ? down : false
        ],
      })
    },
    { pointerEvents: true, pointer: { touch: true } }
  )

  // console.log('RERENDER APP')

  return (
    <div className="App">
      <header> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> </header>
      
      <SC scRef={scRef}/>

      <Suspense fallback={<Loading/>}>
        <div 
          className="THREE" 
          {...bind()}
        >
          <Canvas 
            // frameloop="demand"
            shadows
            dpr={window.devicePixelRatio*pixRat}
            onPointerMissed={(e)=>{
              const playing = useStore.getState().playing
              const curCam = useStore.getState().cam
              const curTarget = useStore.getState().curTarget
              useStore.setState({ 
                cam: null,
                playing: curCam === null && curTarget ? !playing : playing
              })
            }}
          >
            <Selection>
              <Scene
                pixRat={pixRat}
              />
              <Balloons/>
              <Cam frameCap={frameCap}/>
              <PostProcessing pixRat={pixRat}/>
            </Selection>
            {/*<FrameLimiter limit={frameCap}/>*/}
          </Canvas>
        </div>
        <InfoPanel scRef={scRef}/>
      </Suspense>

    </div>
  )
}

export default App
