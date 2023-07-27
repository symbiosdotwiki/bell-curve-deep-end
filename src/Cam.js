import { useEffect } from "react"

import { useStore } from './state'
import { useFrame, useThree } from "@react-three/fiber"

import * as THREE from "three"

const defTarget = new THREE.Vector3(0, .8, 0)
const defCam = new THREE.PerspectiveCamera()
defCam.position.y = 1.5
defCam.position.x = -1.5
defCam.position.z = 0
defCam.lookAt(defTarget)

const orbitCam = new THREE.PerspectiveCamera()

function getTarget(cam, length, target){
  const dirVector = new THREE.Vector3()
    cam.getWorldDirection( dirVector )
    target.copy(cam.position).addScaledVector(dirVector, length)
}


export default function Cam(props) {
  const { camera, size, viewport } = useThree()
  let { p, q, t } = props

  // console.log(camera)

  // let qDef = new THREE.Quaternion(camera.quaternion)
  // let pDef = new THREE.Vector3(camera.position)

  const cam = useStore((state) => state.cam)
  const dofTarget = useStore.getState().dofTarget
  let camTarget = new THREE.Vector3().copy(defTarget)

  let camOffset = new THREE.Vector3()

  const resetView = () => {
    q.copy(defCam.quaternion)
    p.copy(defCam.position)
    t.copy(defTarget)

    camOffset.copy(p).addScaledVector(dofTarget, -1)
    getTarget(camera, camOffset.length(), camTarget)
    // camTarget.copy(t)
  }

  if(cam == null) resetView()
  else {
    cam.updateWorldMatrix(true, true)
    cam.getWorldPosition(p.set(0,0,0))
    cam.getWorldQuaternion(q)

    camOffset.copy(p).addScaledVector(dofTarget, -1) 

    getTarget(cam, camOffset.length(), t)
    getTarget(camera, camOffset.length(), camTarget)
    // console.log(t)
  }

  useFrame((state, dt) => {
    const time = state.clock.getElapsedTime() * .5
    const zoom = 1.2 * Math.min(
      viewport.width / viewport.height,
      1
    )
    camera.zoom = zoom  + .03 * (Math.sin(time) + 1) / 2
    camera.position.addScaledVector(new THREE.Vector3(
      Math.sin(time), Math.sin(time*1.1), Math.cos(time*.9)
    ), .002
    )

    let curTarget = new THREE.Vector3()
    getTarget(camera, camOffset.length(), curTarget)
    const drag = useStore.getState().drag
    const lerpAmt = .05

  	if( !drag[2] && (
      camera.position.distanceTo(p) > .001
      || curTarget.distanceTo(t) > .001)
    ){
	    const time = state.clock.getElapsedTime()

	    camera.quaternion.slerp(q, lerpAmt)
	    camera.position.lerp(p, lerpAmt)
      camTarget.lerp(t, lerpAmt)
      // console.log("RESETTING")
		}
    if(drag[2]){
      // const scaleAngle = .5
      const scaleAngle = .5 * size.width / viewport.width

      const sphericalDelta = new THREE.Spherical()
      sphericalDelta.theta = drag[0] / Math.PI / 2 / scaleAngle
      sphericalDelta.phi = drag[1] / Math.PI / scaleAngle

      let offset = new THREE.Vector3().copy(camOffset)
      const spherical = new THREE.Spherical().setFromVector3(offset)
      // console.log("OFFSET", offset)

      spherical.theta -= sphericalDelta.theta
      spherical.phi += sphericalDelta.phi
      spherical.makeSafe()

      offset.setFromSpherical( spherical )

      const dragP = new THREE.Vector3()
      dragP.copy( dofTarget ).add( offset )

      camera.position.lerp(dragP, lerpAmt)
      camTarget.lerp(cam ? dofTarget : defTarget, lerpAmt)

      // console.log(dragP)
      // console.log(dragTheta, dragPhi, dragR, drag)
    }
    else{
      useStore.setState({
        drag: [drag[0] * .94, drag[1] * .94, false],
      })
      // console.log(drag)
    }
    camera.lookAt(camTarget)
    state.camera.updateProjectionMatrix()
  })
  
  useEffect(() => {
    camera.position.copy(defCam.position)
    camera.quaternion.copy(defCam.quaternion)
    resetView()
  }, [])

  return
}

Cam.defaultProps = {
  p : new THREE.Vector3(-2,2,0),
  q : new THREE.Quaternion(),
  t : new THREE.Vector3(0,1.5,0),
}
