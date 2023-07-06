import React, { useRef } from 'react'

import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from '@react-three/drei'

import { useStore } from './state'
import { mapping } from './mapping'

const gltfURL = process.env.PUBLIC_URL + '/balloons.glb'

export default function Scene(props) {
  const ref = useRef()
  const gltf = useGLTF(gltfURL)
  const { nodes, materials } = gltf

  const curTrack = useStore((state) => state.curTrack)

  useFrame(() => (ref.current.rotation.y += 0.002))
  
  useThree(({camera}) => {
    camera.position.y = 5
    camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={ref} {...props} dispose={null}>
    {Object.keys(nodes).map((key,idx) => {
      const geo = nodes[key]
      const mat = materials[key]
      return <primitive 
        key={key}
        object={geo} 
        onClick={() => {
          useStore.setState({'curTrack':mapping[key]})
          
          console.log(key, curTrack)
        }}
      />
    })}
    </group>
  )
}

useGLTF.preload(gltfURL)