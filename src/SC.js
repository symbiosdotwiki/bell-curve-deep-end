import { useRef, useEffect } from "react"
import { useStore, scURL } from './state'
import ReactPlayer from 'react-player/soundcloud'

function TrackSelector(props) {
	const { selectTrack, setNext, playPause, setTrackTitle } = props

	const curTrack = useStore((state) => state.curTrack)
  const playing = useStore((state) => state.playing)
  const trackTitle = useStore((state) => state.trackTitle)

  setTrackTitle(trackTitle)
  selectTrack(curTrack)
  playPause(playing)

	return 
}

export default function SC(props) {
  const { scRef } = props

  let curTrack = 0
  let trackTitle = null
  let playing = false

  // console.log('RERENDER: SC')

  const setTrackTitle = (tt) => {
  	trackTitle = tt
  }

  const playPause = (setPlaying) => {
  	playing = setPlaying
  	if(!scRef.current)
  		return
  	if(setPlaying)
  		scRef.current.getInternalPlayer().play()
  	else
  		scRef.current.getInternalPlayer().pause()
  }

  const selectTrack = (track) => {
  	curTrack = track
  	// console.log("selectTrack", track)
	  if(curTrack != null && scRef.current){
	    scRef.current.getInternalPlayer().getCurrentSoundIndex((e)=>{
	      if(e != curTrack || trackTitle == null){
	      	// console.log("selectTrack")
	        scRef.current.getInternalPlayer().skip(curTrack)
	        scRef.current.getInternalPlayer().seekTo(0)
	        scRef.current.getInternalPlayer().getCurrentSound((s) => {
						useStore.setState({ 
							trackTitle : s.title,
				      clicked: true,
						})
					})
	      }
	    })
	  }
	}

	const checkAndSetNext = (e) => {
		scRef.current.getInternalPlayer().getCurrentSoundIndex((e)=>{
			scRef.current.getInternalPlayer().getCurrentSound((s)=>{
	      if((e != curTrack && curTrack !== null) || (trackTitle == null && playing)){
	      	curTrack = e
	      	// console.log("checkAndSetNext", "curTrack", curTrack, "playing", playing)
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
      	// console.log("handleKeyUp", curTrack)
        useStore.setState({ 
        	playing: !playing,
        	curTrack: curTrack,
        })
      }
    }
    const setNextTrack = (e) => {
      // console.log(e)
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
		    	// console.log("FINISH")
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
		  	setTrackTitle={setTrackTitle}
		  />
	  </>
  )
}