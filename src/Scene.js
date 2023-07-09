import React, { useRef, useEffect } from 'react'

import * as THREE from "three"

import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF, useTexture, Environment, Sparkles } from '@react-three/drei'

import { useStore } from './state'
import { mapping } from './mapping'
import { findValuesByKey } from './helpers'

const gltfURL = process.env.PUBLIC_URL + '/scene.glb'

const defCam = new THREE.PerspectiveCamera()
defCam.position.y = 1.5
defCam.position.x = -1.5
defCam.position.z = 0
defCam.lookAt(0, .8, 0)



export default function Scene(props) {
  const ref = useRef()
  const lightRef = useRef()

  const gltf = useGLTF(gltfURL)
  const { nodes, materials } = gltf

  const { camera } = useThree()
  let { p, q } = props

  let qDef = new THREE.Quaternion(camera.quaternion)
  let pDef = new THREE.Vector3(camera.position)

  const cam = useStore((state) => state.cam)
  const curTrack = useStore((state) => state.curTrack)

  gltf.scene.children.forEach((mesh, i) => {
        mesh.castShadow = true;
    })
  gltf.castShadow = true;
  gltf.scene.castShadow = true;
  const meshes = Object.keys(nodes).filter(key => 
    !key.includes('_Cam') && !key.includes('_CAM') && !key.includes('Root')
  )

  const resetView = () => {
    q.copy(defCam.quaternion)
    p.copy(defCam.position)
  }

  if(cam == null) resetView()
  else {
    cam.updateWorldMatrix(true, true)
    cam.getWorldPosition(p.set(0,0,0))
    cam.getWorldQuaternion(q)
  }

  let mats = findValuesByKey(gltf.scene.children, 'material', ['parent'])

  useFrame((state, dt) => {
    const lerpAmt = .05

    const time = state.clock.getElapsedTime()
    lightRef.current.rotation.y = time/40

    camera.quaternion.slerp(q, lerpAmt)
    camera.position.lerp(p, lerpAmt)
    state.camera.updateProjectionMatrix()
  })
  
  useEffect(() => {
    camera.position.copy(defCam.position)
    camera.quaternion.copy(defCam.quaternion)
    resetView()
  }, [])

  const hdriUrl = process.env.PUBLIC_URL + "/00024.hdr"

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
        // return
        return <mesh 
          castShadow receiveShadow
          key={idx}
          geometry={geo.geometry}
          // material={matt}
          material={geo.material}
        />
      })}
      <Sparkles count={1000} scale={4} speed={.3} opacity={.5}/>
      <Environment 
        // map={hdri} 
        background 
        // preset={'sunset'}
        files={hdriUrl}
      />
      {/*<ambientLight intensity={.5} />*/}
      <group ref={lightRef}>
        <directionalLight
          castShadow
          color="white"
          intensity={1.9}
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

Scene.defaultProps = {
  p : new THREE.Vector3(-2,2,0),
  q : new THREE.Quaternion(),
}

useGLTF.preload(gltfURL)