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
  const gltf = useGLTF(gltfURL)
  const { nodes, materials } = gltf

  const { camera } = useThree()
  let { p, q } = props

  let qDef = new THREE.Quaternion(camera.quaternion)
  let pDef = new THREE.Vector3(camera.position)

  const cam = useStore((state) => state.cam)

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
      // console.log('mat', geo.geometry)
      return <mesh 
        castShadow receiveShadow
        key={idx}
        geometry={geo.geometry}
        material={geo.material}
      />
    })}
    <Environment map={hdri} background onClick={()=>{console.log('click')}}/>
    <directionalLight
          // ref={light}
          castShadow
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