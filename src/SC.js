import { useRef, useEffect } from "react"
import { useStore, scURL } from './state'
import ReactPlayer from 'react-player/soundcloud'

function TrackSelector(props) {
	const { selectTrack, setNext, playPause } = props

	const curCam = useStore((state) => state.cam)
	const curTrack = useStore((state) => state.curTrack)
  const nextCam = useStore((state) => state.nextCam)
  const nextTarget = useStore((state) => state.nextTarget)
  const playing = useStore((state) => state.playing)

  selectTrack(curTrack)
  setNext(nextCam, nextTarget, curCam)
  playPause(playing)

	return 
}

export default function SC() {
  const scRef = useRef()

  let nextCam = null
  let nextTarget = null
  let curTrack = null
  let curCam = null

  // console.log('RERENDER: SC')

  const playPause = (playing) => {
  	if(!scRef.current)
  		return
  	if(playing)
  		scRef.current.getInternalPlayer().play()
  	else
  		scRef.current.getInternalPlayer().pause()
  }

  const selectTrack = (track) => {
  	curTrack = track
	  if(curTrack != null && scRef.current){
	    scRef.current.getInternalPlayer().getCurrentSoundIndex((e)=>{
	      if(e != curTrack){
	        scRef.current.getInternalPlayer().skip(curTrack)
	        scRef.current.getInternalPlayer().seekTo(0)
	      }
	    })
	  }
	}

	const checkAndSetNext = (e) => {
		scRef.current.getInternalPlayer().getCurrentSoundIndex((e)=>{
      if(e != curTrack){
        // console.log('SOUND ENDED')
        useStore.setState({ 
          curTrack: e,
          cam: curCam ? nextCam : curCam,
          curTarget: nextTarget,
        })
      }
    })
	}

	const setNext = (cam, tar, curCam) => {
		nextCam = cam
		nextTarget = tar
		curCam = curCam
	}

  useEffect(() => {
    const handleKeyUp = (e) => {
      // console.log(e.code)
      if(e.code==='Space')
        scRef.current.getInternalPlayer().toggle()
    }
    const setNextTrack = (e) => {
      console.log(e)
    }
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
  	<>
			<ReactPlayer 
		    className='sc-player'
		    url={scURL} 
		    width={'100%'}
		    height={'10%'}
		    ref={scRef}
		    // onPlay={}
		    onProgress={checkAndSetNext}
		    onEnded={(e) => {"FINISH"}}
		    config={{
		      playing:true,
		      soundcloud:{
		        options:{
		          auto_play:false
		        }
		      }
		    }}
		  />
		  <TrackSelector
		  	selectTrack={selectTrack}
		  	setNext={setNext}
		  	playPause={playPause}
		  />
	  </>
  )
}