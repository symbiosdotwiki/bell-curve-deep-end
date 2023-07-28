import { useEffect } from "react"
import { useStore, scURL } from './state'

import { SoftShadows, Stats } from "@react-three/drei"
import { 
  EffectComposer, DepthOfField, Bloom, Selection, Outline, 
  Vignette, ChromaticAberration,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'


function StatsContainer(props) {
	const stats = useStore((state) => state.stats)

	useEffect(() => {
    const handleKeyUp = (e) => {
    	const s = useStore.getState().stats
      if(e.code==='KeyS'){
        useStore.setState({ 
        	stats: !s
        })
      }
    }
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

	return (
		<>
			{ stats ? <Stats/> : '' }
		</>
	)
}

function Effects(props) {
	const { pixRat } = props
	const dofTarget = useStore((state) => state.dofTarget)

	return (
		<EffectComposer multisampling={0} autoClear={false}>
	    <DepthOfField 
	      target={dofTarget} 
	      focalLength={0.002} 
	      bokehScale={8} 
	      height={1024 * pixRat} 
	    />
	    <Bloom luminanceThreshold={.5} mipmapBlur luminanceSmoothing={0.0} intensity={.35} />
	    <Bloom luminanceThreshold={.75} mipmapBlur luminanceSmoothing={0.0} intensity={1} />
	    <Outline 
	      visibleEdgeColor="turquoise" 
	      hiddenEdgeColor="turquoise" 
	      blur 
	      width={1024 * pixRat} 
	      edgeStrength={4} 
	      blendFunction={BlendFunction.ALPHA}
	      pulseSpeed={.2}
	    />
	    <Vignette
        offset={.5}
        darkness={.5}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
    blendFunction={BlendFunction.NORMAL} // blend mode
    offset={[0.001, 0.0005]} // color offset
  />
	  </EffectComposer>
  )
}

export default function PostProcessing(props) {
	const { pixRat } = props

  // console.log('RERENDER: Post Processing')

  return (
  	<>
  		<StatsContainer />
			<fog attach="fog" args={[`hsl(195, 69%, 48%)`, .5, 5]} density={.15} />
	  	<SoftShadows size={10} samples={10} />
	    <Effects pixRat={pixRat}/>
	  </>
  )
}