import React, { useRef, useEffect } from 'react'

import * as THREE from "three"

import { useFrame } from "@react-three/fiber"
import { useGLTF, useTexture, Environment, Sparkles } from '@react-three/drei'

import { findValuesByKey } from './helpers'

const gltfURL = process.env.PUBLIC_URL + '/scene.glb'


export default function Scene(props) {
  const ref = useRef()
  const lightRef = useRef()

  const gltf = useGLTF(gltfURL)
  const { nodes, materials } = gltf

  let { p, q } = props

  console.log('RERENDER: SCENE')
  // console.log('cam: ', cam, 'curTrack: ', curTrack)

  gltf.scene.children.forEach((mesh, i) => {
        mesh.castShadow = true;
    })
  gltf.castShadow = true;
  gltf.scene.castShadow = true;
  const meshes = Object.keys(nodes).filter(key => 
    !key.includes('_Cam') && !key.includes('_CAM') && !key.includes('Root')
  )


  let mats = findValuesByKey(gltf.scene.children, 'material', ['parent'])

  useFrame((state, dt) => {
    const time = state.clock.getElapsedTime()
    lightRef.current.rotation.y = Math.sin(time/20) - .25 * Math.PI
  })

  const hdriUrl = process.env.PUBLIC_URL + "/00025.hdr"

  return (
    <group ref={ref} {...props} dispose={null}>
      {meshes.map((key,idx) => {
        const geo = nodes[key]
        const mat = materials[key]
        const cam = nodes[key + '_Cam']

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
          shadow-mapSize={2048}
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