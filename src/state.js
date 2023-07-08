import create from 'zustand'
import * as THREE from "three"

export const defaultState = {
  curTrack: 0,
  // p:  new THREE.Vector3(0,2,0),
  // q: new THREE.Quaternion(),
  cam: null,
  curTarget: null,
  // activeCam: null,
  // activeObj: null,
  // activeTile: null,
  // activeShape: null,
  // camResetDone: false,
  // clickObj: null,
}

// defaultState.q.setFromAxisAngle( new THREE.Vector3( 0, 1, 1 ), -Math.PI / 2 );

export const useStore = create((set) => ({
  ...defaultState,
  resetState: () => set(defaultState)
  // setActiveCam: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
}))