import { useRef, useEffect } from "react"
import { useStore } from './state'

import { FaInstagram, FaSoundcloud,  FaTwitter} from "react-icons/fa"
// import { FaSoundcloud } from 'react-icons/fa/brands'
const mainLogo = process.env.PUBLIC_URL + '/bellcurve.png'

export default function InfoPanel(props){
	const { scRef } = props
	const trackTitle = useStore((state) => state.trackTitle)

	return (
		<div className="INFO">
      <img  src={mainLogo} />
      <div className="TITLE"> DEEP END </div>
      <div className="Playing"> {
      	trackTitle ? "Now Playing:" : "Click A Balloon To Start"
      } </div>
      <div className="TrackInfo"> {trackTitle} </div>
      <div className="LINKS">
      	<FaSoundcloud/> <FaInstagram/> <FaTwitter/>
      </div>
    </div>
	)
}