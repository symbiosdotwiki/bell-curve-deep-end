import React, { useRef } from 'react'

import { useDrag } from 'react-use-gesture'
import { useStore } from './state'

import * as THREE from "three"

import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF, Environment, Sparkles } from '@react-three/drei'

import { findValuesByKey } from './helpers'

const gltfURL = process.env.PUBLIC_URL + '/scene.glb'


export default function Scene(props) {
  const { pixRat } = props

  const ref = useRef()
  const lightRef = useRef()

  const gltf = useGLTF(gltfURL)
  const { nodes, materials } = gltf

  // console.log('RERENDER: SCENE', pixRat)

  const shadowSize = 2048;//Math.min(Math.floor(2048 * pixRat), 1024)

  gltf.scene.children.forEach((mesh, i) => {
        mesh.castShadow = true;
    })
  gltf.castShadow = true;
  gltf.scene.castShadow = true;
  const meshes = Object.keys(nodes).filter(key => 
    !key.includes('_Cam') && !key.includes('_CAM') && !key.includes('Root')
  )

  useFrame((state, dt) => {
    const time = state.clock.getElapsedTime()
    lightRef.current.rotation.y = Math.sin(time/20) - .25 * Math.PI
  })

  // const bind = useDrag(
  //   ({down, movement: [x, y], event }) => {
  //     const moved = Math.sqrt(x*x + y*y)
  //     // if(!moved){
  //     //   const playing = useStore.getState().playing
  //     //   const curCam = useStore.getState().cam
  //     //   const curTarget = useStore.getState().curTarget
  //     //   useStore.setState({ 
  //     //     cam: null,
  //     //     playing: curCam === null && curTarget ? !playing : playing
  //     //   })
  //     // }
  //     useStore.setState({
  //       drag: [
  //         x / aspect, 
  //         -y / aspect, 
  //         moved > .02 ? down : false
  //       ],
  //     })
  //     if(!down){
  //       // let planeIntersectPoint = new THREE.Vector3()
  //       // event.ray.intersectPlane(floorPlane, planeIntersectPoint)
  //       console.log(moved)
  //     }
  //   },
  //   { pointerEvents: true, capture: false }
  // )

  const hdriUrl = process.env.PUBLIC_URL + "/00025.hdr"

  return (
    <group ref={ref} {...props} dispose={null} >
      {meshes.map((key,idx) => {
        const geo = nodes[key]

        if(geo.material)
          geo.material.metalness = 0

        if(geo.name.includes('OUT'))
          geo.material.side = THREE.DoubleSide

        if(geo.name.includes('Sand'))
          geo.material.roughness = .9

        return <mesh 
          castShadow receiveShadow
          key={idx}
          geometry={geo.geometry}
          material={geo.material}
        />
      })}
      <Sparkles count={1000} scale={4} speed={.3} opacity={.5}/>
      <Environment 
        background 
        files={hdriUrl}
      />
      <ambientLight intensity={.15} />
      <group ref={lightRef}>
        <directionalLight
          castShadow
          color="white"
          intensity={1.3}
          position={[-2, 2, 2]}
          shadow-mapSize={shadowSize}
          target-position={[0, 1, 0]}
          shadow-bias={-0.001}
        >
          <orthographicCamera attach="shadow-camera" args={[-3, 3, 3, -3, .1, 10]} />
        </directionalLight>
      </group>
    </group>
  )
}

useGLTF.preload(gltfURL)