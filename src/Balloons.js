import React, { useRef } from 'react'

import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF, PerspectiveCamera } from '@react-three/drei'

import { useStore } from './state'
import { mapping } from './mapping'

const gltfURL = process.env.PUBLIC_URL + '/balloons.glb'

const Cam = (props) => {
  const { cam, camRef } = props
  let q = new THREE.Quaternion()
  let p = new THREE.Vector3()
  // console.log(cam)
  // if(cam){
    cam.updateWorldMatrix(true, true)
    cam.getWorldPosition(p.set(0, 0, 0))
    cam.getWorldQuaternion(q)
  // }

  return (
    <PerspectiveCamera 
      ref={camRef}
      position={p}
      quaternion={q}
    />
  )
}

function Balloon(props){
  const { geo, cam } = props
  let camRef = useRef()

  const clickGeo = (e) => {
    if(e) e.stopPropagation()
    useStore.setState({ 
      curTrack: mapping[geo.name],
      cam: camRef.current ,
    })
  console.log(camRef.current)
  }

  // console.log('hi')

  return (
    <group>
      <Cam camRef={camRef} cam={cam} />
      <primitive 
        object={geo} 
        onClick={() => {
          useStore.setState({
            'curTrack':mapping[geo.name],
            'cam': camRef.current,
          })
          // console.log(camRef.current.position)
          
          // console.log(geo)
        }}
      />
      </group>
    )
}

export default function Balloons(props) {
  const ref = useRef()
  const gltf = useGLTF(gltfURL)
  const { nodes, materials } = gltf

  // console.log(gltf)


  Object.keys(nodes).map((key,idx) => {
    const geo = nodes[key]
    // console.log(key, geo)
  })

  const meshes = Object.keys(nodes).filter(key => 
    !key.includes('_Cam') && !key.includes('_CAM') && !key.includes('Root')
  )
  const cams = Object.keys(nodes).filter(key => 
    !meshes.includes(key) && !key.includes('Root')
  )
  // console.log(cams, meshes)

  // useFrame(() => (ref.current.rotation.y += 0.002))

  return (
    <group ref={ref} {...props} dispose={null}>
    {meshes.map((key,idx) => {
      const geo = nodes[key]
      const mat = materials[key]
      const cam = nodes[key + '_Cam']
      if(!cam) return 
      // console.log(cam)
      return <Balloon 
          key={idx}
          geo={geo} 
          cam={cam}
        />
    })}
    </group>
  )
}

useGLTF.preload(gltfURL)