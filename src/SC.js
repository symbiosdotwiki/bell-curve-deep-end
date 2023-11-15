import { useRef, useEffect } from "react"
import { useStore, scURL } from './state'
import ReactPlayer from 'react-player/soundcloud'

function TrackSelector(props) {
	const { selectTrack, setNext, playPause } = props

	const curTrack = useStore((state) => state.curTrack)
  const playing = useStore((state) => state.playing)

  selectTrack(curTrack)
  playPause(playing)

	return 
}

export default function SC(props) {
  const { scRef } = props

  let nextCam = null
  let nextTarget = null
  let nextDOFTarget = null
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
	        scRef.current.getInternalPlayer().seekTo(220000)
	        scRef.current.getInternalPlayer().getCurrentSound((s) => {
						useStore.setState({ trackTitle : s.title })
					})
	      }
	    })
	  }
	}

	const checkAndSetNext = (e) => {
		scRef.current.getInternalPlayer().getCurrentSoundIndex((e)=>{
		scRef.current.getInternalPlayer().getCurrentSound((s)=>{
      if(e != curTrack){
      	const newCam = curCam != null ? nextCam : curCam
        useStore.setState({ 
          curTrack: e,
          trackTitle : s.title,
        })
      }
    })
	})
	}

  useEffect(() => {
    const handleKeyUp = (e) => {
      if(e.code==='Space'){
      	const playing = useStore.getState().playing
        useStore.setState({ 
        	playing: !playing
        })
      }
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
		    onEnded={(e) => {
		    	console.log("FINISH")
		    	useStore.setState({ 
	          curTrack: 0,
	          // trackTitle : s.title,
	        })
		    }}
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
		  	playPause={playPause}
		  />
	  </>
  )
}