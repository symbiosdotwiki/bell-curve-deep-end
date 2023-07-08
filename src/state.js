import create from 'zustand'
import * as THREE from "three"

// export const scURL = 'https://soundcloud.com/bell_curve/sets/deep-end-mastered/s-nEZAnDMbc0Z'
export const scURL = "https://api.soundcloud.com/playlists/1648753261?secret_token=s-nEZAnDMbc0Z"
export const defaultState = {
  curTrack: 0,
  cam: null,
  curTarget: null,
}

export const useStore = create((set) => ({
  ...defaultState,
  resetState: () => set(defaultState)
}))


// <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/854631766%3Fsecret_token%3Ds-7PZSj4oQbPz&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/isaka_symbios_wiki" title="isaka.symbios.wiki" target="_blank" style="color: #cccccc; text-decoration: none;">isaka.symbios.wiki</a> · <a href="https://soundcloud.com/isaka_symbios_wiki/isomov-convolver-demo-4-9-20/s-7PZSj4oQbPz" title="Isomov - Convolver (demo 4 9 20)" target="_blank" style="color: #cccccc; text-decoration: none;">Isomov - Convolver (demo 4 9 20)</a></div>

// https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/854631766%3Fsecret_token%3Ds-7PZSj4oQbPz&color=%23ff5500