import React, { useRef, useEffect } from 'react'

import * as THREE from "three"

import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF, useTexture, Environment } from '@react-three/drei'

import { useStore } from './state'
import { mapping } from './mapping'
import { findValuesByKey } from './helpers'

const gltfURL = process.env.PUBLIC_URL + '/scene.glb'

export default function Scene(props) {
  const ref = useRef()
  const gltf = useGLTF(gltfURL)
  const { nodes, materials } = gltf

  const { camera } = useThree()
  let { p, q } = props

  let qDef = new THREE.Quaternion(camera.quaternion)
  let pDef = new THREE.Vector3(camera.position)

  const cam = useStore((state) => state.cam)
  // console.log('CAM', cam)
  // const q = useStore((state) => state.q)

  const resetView = () => {
    // let dist = portrait ? 230 : 180
    q.copy(qDef)
    p.copy(pDef)
    // useStore.setState({
    //   q: new THREE.Quaternion(camera.quaternion),
    //   p: new THREE.Quaternion(camera.quaternion)
    // })
  }

  if(cam == null) {}//resetView()
  else {
    cam.updateWorldMatrix(true, true)
    cam.getWorldPosition(p.set(0,0,0))
    cam.getWorldQuaternion(q)
    console.log('here', p)
  }



  // console.log(gltf)

  let mats = findValuesByKey(gltf.scene.children, 'material', ['parent'])
  // console.log(mats)

  materials.principledshader.side = THREE.DoubleSide
  mats.forEach(mat => {
    mat.side = THREE.DoubleSide
  })

  const curTrack = useStore((state) => state.curTrack)

  useFrame((state, dt) => {
    const lerpAmt = .05

    // camera.zoom = portrait ? .2 : .25

    // ref.current.rotation.y += 0.002
    // if(!q || !p){
    //   p = pDef
    //   q = qDef
    // }
    // console.log(p)
    camera.quaternion.slerp(q, lerpAmt)
    camera.position.lerp(p, lerpAmt)
    state.camera.updateProjectionMatrix()
  })
  
  useEffect(() => {
    camera.position.y = 2
    camera.position.x = -1
    camera.position.z = 0
    camera.lookAt(0, .5, 0)
    qDef = camera.quaternion
    pDef = camera.position
    resetView()
    // qDefault = camera.quaternion
  }, [])

  const hdriUrl = process.env.PUBLIC_URL + "/00024.png"
  const hdri = useTexture(hdriUrl)

  return (
    <group ref={ref} {...props} dispose={null}>
    <primitive 
      object={gltf.scene}
    />
    <Environment map={hdri} background />
    <directionalLight
          // ref={light}
          // castShadow
          color="white"
          intensity={.9}
          position={[-150, 150, 150]}
          angle={0.15}
          penumbra={1}
          shadow-mapSize={[512, 512]}
          shadow-bias={-0.001}
          target-position={[0, 0, 0]}
          // onUpdate={(self) => self.target.updateMatrixWorld()}
        />
    </group>
  )
}

Scene.defaultProps = {
  p : new THREE.Vector3(-2,2,0),
  q : new THREE.Quaternion(),
}

// const pStart = new THREE.Vector3()
// pStart.copy(Scene.defaultProps.p)
// pStart.sub(new THREE.Vector3( 0, 0, 0 ))
// pStart.normalize()
// pStart.multiplyScalar(-1)

// const qStart = new THREE.Quaternion()
// qStart.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), -Math.PI / 2 );
// Scene.defaultProps.q.setFromUnitVectors(new THREE.Vector3( .5, 5, 0 ), pStart.normalize());
// Scene.defaultProps.q.multiply(qStart)

useGLTF.preload(gltfURL)