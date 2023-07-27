import { Suspense, useEffect } from "react"

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

import { glCheck, mobileAndTabletCheck } from './helpers'

// import logo from './logo.svg'
import './App.css'

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

  const glInfo = glCheck()
  const isMobile = mobileAndTabletCheck()

  const hasGL = glInfo.error ? false : true
  const hdState = glInfo.card === null || isMobile ? false : true
  const pixRat = hdState ? 1 : .5

  // const { size, viewport } = useThree()
  const aspect = 1//size.width / viewport.width

  const bind = useDrag(
    ({down, movement: [x, y], event }) => {
      const moved = Math.sqrt(x*x + y*y)
      // console.log(moved)
      useStore.setState({
        drag: [
          x, 
          -y, 
          moved > 1 ? down : false
        ],
      })
      // if(!down){
      //   let planeIntersectPoint = new THREE.Vector3()
      //   event.ray.intersectPlane(floorPlane, planeIntersectPoint)
      //   console.log(moved)
      // }
    },
    { pointerEvents: true, pointer: { touch: true } }
  )

  // console.log('RERENDER: APP')

  return (
    <div className="App">
      <header> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> </header>
      
      <SC/>

      <Suspense fallback={<Loading/>}>
        <div className="THREE" 
        {...bind()}
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
              <Cam/>
              <PostProcessing pixRat={pixRat}/>
            </Selection>
          </Canvas>

        </div>
      </Suspense>

    </div>
  )
}

export default App
