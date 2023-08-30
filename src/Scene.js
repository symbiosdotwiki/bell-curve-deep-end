import React, { useRef } from 'react'

import { useDrag } from 'react-use-gesture'

import * as THREE from "three"

import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF, Environment, Sparkles } from '@react-three/drei'

import { findValuesByKey } from './helpers'

const gltfURL = process.env.PUBLIC_URL + '/scene.glb'

function SceneObject(props) {
  const { geo } = props
  const { viewport } = useThree()
  const geoRef = useRef()

  let p = new THREE.Vector3()
  geo.updateWorldMatrix(true, true)
  geo.getWorldPosition(p.set(0,0,0))

  // useFrame((state, dt) => {
  //   // console.log(p)
  //   geoRef.current.scale.z = Math.max( 1, viewport.width / viewport.height)
  // })

  return (
    <mesh 
      castShadow receiveShadow
      ref={geoRef}
      geometry={geo.geometry} 
      material={geo.material}
    />
  )
}

export default function Scene(props) {
  const { pixRat } = props

  const ref = useRef()
  const lightRef = useRef()

  const gltf = useGLTF(gltfURL)
  const { nodes, materials } = gltf

  const shadowSize = 2048;

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

  const hdriUrl = process.env.PUBLIC_URL + "/00025.hdr"

  // console.log('RERENDER SCENE')

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

        return <SceneObject geo={geo}/>
      })}
      <Sparkles count={1000} scale={4} speed={.3} opacity={.5}/>
      <Environment 
        background 
        files={hdriUrl}
      />
      {/*<Sphere/>*/}
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