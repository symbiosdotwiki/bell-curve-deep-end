import create from 'zustand'

export const defaultState = {
  curTrack: 0,
  // activeCam: null,
  // activeObj: null,
  // activeTile: null,
  // activeShape: null,
  // camResetDone: false,
  // clickObj: null,
}

export const useStore = create((set) => ({
  ...defaultState,
  resetState: () => set(defaultState)
  // setActiveCam: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
}))