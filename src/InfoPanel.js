import { useRef, useEffect } from "react"
import { useStore } from './state'

import { IconContext } from 'react-icons'
import { FaInstagram, FaSoundcloud,  FaTwitter} from "react-icons/fa"

import { ReactComponent as S } from './S.svg'
// import { FaSoundcloud } from 'react-icons/fa/brands'
const mainLogo = process.env.PUBLIC_URL + '/bellcurve.png'

export default function InfoPanel(props){
	const { scRef } = props
	const trackTitle = useStore((state) => state.trackTitle)

  const links = {
    'sc' : 'https://soundcloud.com/bell_curve',
    'insta' : 'https://www.instagram.com/bell.curve',
    'twitter' : 'https://twitter.com/isabellcurve',
    'symbios' : 'https://www.symbios.wiki/',
  }

  const openPage = (url) => {
    window.open(url, "_blank")
  }

	return (
    	<div className="INFO">
        <div className="INFO-block1">
          <img  src={mainLogo} />
          <div className="TITLE"> DEEP END </div>
        </div>
        <div className="INFO-block2">
          <div className="Playing"> {
          	trackTitle ? "Now Playing:" : "Click A Balloon To Start"
          } </div>
          <div className="TrackInfo"> {trackTitle} </div>
        </div>
        <div className="LINKS">
          <IconContext.Provider value={{size: 42}}>
          	<FaSoundcloud
              className="fa-lg" 
              onClick={() => openPage(links.sc)}
            /> 
            <FaInstagram
              className="fa-lg" 
              onClick={() => openPage(links.insta)}
            /> 
            <FaTwitter
              className="fa-lg" 
              onClick={() => openPage(links.twitter)}
            />
            <S
              onClick={() => openPage(links.symbios)}
            />
          </IconContext.Provider>
        </div>
    </div>
	)
}