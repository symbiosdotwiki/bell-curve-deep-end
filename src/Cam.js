import { useEffect } from "react"

import { useStore } from './state'
import { useFrame, useThree } from "@react-three/fiber"

import * as THREE from "three"

const defCam = new THREE.PerspectiveCamera()
defCam.position.y = 1.5
defCam.position.x = -1.5
defCam.position.z = 0
defCam.lookAt(0, .8, 0)


export default function Cam(props) {
  const { camera } = useThree()
  let { p, q } = props

  // console.log(camera)

  let qDef = new THREE.Quaternion(camera.quaternion)
  let pDef = new THREE.Vector3(camera.position)

  const cam = useStore((state) => state.cam)

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

  useFrame((state, dt) => {
  	if(camera.position.distanceTo(p) > .01){
	    const lerpAmt = .05

	    const time = state.clock.getElapsedTime()

	    camera.quaternion.slerp(q, lerpAmt)
	    camera.position.lerp(p, lerpAmt)
	    state.camera.updateProjectionMatrix()
		}
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
}
