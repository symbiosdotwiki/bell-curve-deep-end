import React, { useRef, useEffect } from 'react'

import * as THREE from "three"

import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF, useTexture, Environment } from '@react-three/drei'

import { useStore } from './state'
import { mapping } from './mapping'
import { findValuesByKey } from './helpers'

const gltfURL = process.env.PUBLIC_URL + '/scene.glb'

const defCam = new THREE.PerspectiveCamera()
defCam.position.y = 2
defCam.position.x = -1
defCam.position.z = 0
defCam.lookAt(0, .5, 0)



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

  // materials.principledshader.side = THREE.DoubleSide
  // mats.forEach(mat => {
  //   mat.side = THREE.DoubleSide
  // })

  useFrame((state, dt) => {
    const lerpAmt = .05

    const time = state.clock.getElapsedTime()
    lightRef.current.rotation.y = time/10
    // lightRef.current.position.z = Math.cos(time/10)
    // lightRef.current.updateWorldMatrix(true, true)
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
    camera.position.copy(defCam.position)
    camera.quaternion.copy(defCam.quaternion)
    resetView()
  }, [])

  const hdriUrl = process.env.PUBLIC_URL + "/00024.png"
  const hdri = useTexture(hdriUrl)

  return (
    <group ref={ref} {...props} dispose={null}>
      {meshes.map((key,idx) => {
        const geo = nodes[key]
        const mat = materials[key]
        const cam = nodes[key + '_Cam']
        // const matt = new THREE.MeshLambertMaterial()
        if(geo.name.includes('OUT'))
          geo.material.side = THREE.DoubleSide
        // matt.map = geo.material.map
        // console.log('mat', geo.name)
        return <mesh 
          castShadow receiveShadow
          key={idx}
          geometry={geo.geometry}
          // material={matt}
          material={geo.material}
        />
      })}
      <Environment map={hdri} background onClick={()=>{console.log('click')}}/>
      <ambientLight intensity={.5} />
      <group ref={lightRef}>
        <directionalLight
          // ref={lightRef}
          castShadow
          color="white"
          intensity={1.9}
          position={[-2, 2, 2]}
          shadow-mapSize={1024}
          target-position={[0, 1, 0]}
          shadow-bias={-0.001}
          // onUpdate={(self) => self.target.updateMatrixWorld()}
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