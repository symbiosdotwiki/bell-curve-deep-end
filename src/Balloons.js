import { useRef, useEffect } from 'react'

import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useGLTF, PerspectiveCamera } from '@react-three/drei'

import { 
  Select
} from '@react-three/postprocessing'


import { useStore } from './state'
import { mapping, tracklist } from './mapping'
import { angleDist } from './helpers'

import TrackTitle from './TrackTitle'

const gltfURL = process.env.PUBLIC_URL + '/balloons.glb'

const Cam = (props) => {
  const { cam, camRef } = props
  let q = new THREE.Quaternion()
  let p = new THREE.Vector3()
  
  cam.updateWorldMatrix(true, true)
  cam.getWorldPosition(p.set(0, 0, 0))
  cam.getWorldQuaternion(q)

  return (
    <PerspectiveCamera 
      ref={camRef}
      position={p}
      quaternion={q}
    />
  )
}

function Balloon(props){
  const { geo, cam, meshes, nodes } = props

  const camRef = useRef()
  const geoRef = useRef()

  let oTheta = geo.rotation.y
  let curTheta = useRef(0)

  const trackNum = tracklist.indexOf(mapping[geo.name])

  // console.log('RERENDER: ', geo.name)

  const curTarget = useStore(
    (state) => state.curTarget,
    (o, n) => {
      return !(o != n && (n === geo.name || o === geo.name))
    }
  )

  const nextMesh = meshes.find(key => 
    mapping[key] === tracklist[trackNum + 1 % tracklist.length]
  )
  const nextNode = nodes[nextMesh]
  const nextTarget = nextNode ? nextNode.name : null
  const nextCam = nodes[nextMesh + "_Cam"]


  const selected = curTarget && curTarget === geo.name

  let q = new THREE.Quaternion()
  let p = new THREE.Vector3()

  const rand1 = Math.random(trackNum*9)
  const rand2 = Math.random(trackNum*99)

  geo.updateWorldMatrix(true, true)
  geo.getWorldPosition(p.set(0,0,0))
  // console.log(geo.name, ' oTheta: ', oTheta)
  // console.log(geo.name, ' curTheta: ', curTheta)
  if(curTheta.current == 0)
    geo.getWorldQuaternion(q)

  const clickGeo = (e) => {
    const playing = useStore.getState().playing
    const curCam = useStore.getState().cam
    geo.getWorldPosition(p)
    if(e) e.stopPropagation()
    useStore.setState({ 
      curTrack: trackNum,
      cam: camRef.current,
      curTarget: geo.name,
      nextTarget: nextTarget,
      nextCam: nextCam,
      dofTarget: p,
      playing: selected && curCam == camRef.current ? !playing : true
    })
  }

  useFrame((state, dt) => {
    const playing = useStore.getState().playing
    let rot = geoRef.current.rotation

    const time = state.clock.getElapsedTime()
    const wiggle = Math.exp((Math.cos(time/(1.5 + .5*rand2) + 99*rand1) + 1)/2) / Math.exp(0)
    geoRef.current.position.y =  p.y + .01 * wiggle

    const dist = angleDist(curTheta.current, oTheta)
    if(selected){
      curTheta.current += playing ? .006 : .001
    }
    else if( dist > .001){
      if(curTheta.current < oTheta)
        curTheta.current += dist * .1
      else 
        curTheta.current -= dist * .1
    }
    curTheta.current %= Math.PI * 2
    rot.y = curTheta.current
    rot.y %= Math.PI * 2
  })

  useEffect(() => {
    geo.material.roughness = .1
    geo.material.metalness = .25
    geo.material.side = THREE.DoubleSide
    geo.material.envMapIntensity = 1
    geo.material.needsUpdate = true

    // oTheta = geoRef.current.position.y
  }, [])

  return (
    <group>
      <Cam camRef={camRef} cam={cam} />
      <group 
        position={p}
        quaternion={q}
        ref={geoRef}
        onClick={clickGeo}
      >
        <Select name={geo.name} enabled={selected}>
        <TrackTitle
          name={mapping[geo.name]}
          visible={selected}
          // visible={true}
        />
          <mesh 
            castShadow receiveShadow
            geometry={geo.geometry} 
            material={geo.material}
          />
          </Select>
        </group>
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
            meshes={meshes}
            nodes={nodes}
          />
      })}
    </group>
  )
}

useGLTF.preload(gltfURL)