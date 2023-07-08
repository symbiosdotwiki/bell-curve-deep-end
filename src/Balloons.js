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
  const camRef = useRef()
  const geoRef = useRef()

  let q = new THREE.Quaternion()
  let p = new THREE.Vector3()

  const rand = Math.random()

  const clickGeo = (e) => {
    if(e) e.stopPropagation()
    useStore.setState({ 
      curTrack: mapping[geo.name],
      cam: camRef.current ,
    })
  }

  geo.updateWorldMatrix(true, true)
  geo.getWorldPosition(p.set(0,0,0))
  geo.getWorldQuaternion(q)

  useFrame((state, dt) => {
    const time = state.clock.getElapsedTime()
    const wiggle = Math.exp((Math.cos(time/2 + 99*rand) + 1)/2) / Math.exp(0)
    geoRef.current.position.y =  p.y+ .01 * wiggle
  })

  geo.material.roughness = .1

  return (
    <group>
      <Cam camRef={camRef} cam={cam} />
      <mesh 
        castShadow receiveShadow
        geometry={geo.geometry} 
        material={geo.material}
        position={p}
        quaternion={q}
        ref={geoRef}
        onClick={() => {
          useStore.setState({
            curTrack: mapping[geo.name],
            cam: camRef.current,
            curTarget: geoRef.current,
          })
        }}
      />
      </group>
    )
}

export default function Balloons(props) {
  const ref = useRef()
  const gltf = useGLTF(gltfURL)
  const { nodes, materials } = gltf

  Object.keys(nodes).map((key,idx) => {
    const geo = nodes[key]
  })

  const meshes = Object.keys(nodes).filter(key => 
    !key.includes('_Cam') && !key.includes('_CAM') && !key.includes('Root')
  )
  const cams = Object.keys(nodes).filter(key => 
    !meshes.includes(key) && !key.includes('Root')
  )

  // useFrame(() => (ref.current.rotation.y += 0.002))

  return (
    <group ref={ref} {...props} dispose={null}>
    {meshes.map((key,idx) => {
      const geo = nodes[key]
      const mat = materials[key]
      const cam = nodes[key + '_Cam']
      if(!cam) return 
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