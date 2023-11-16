import { useRef, useEffect } from "react"
import { useStore } from './state'

import { IconContext } from 'react-icons'
import { FaInstagram, FaSoundcloud,  FaBandcamp} from "react-icons/fa"

import { ReactComponent as S } from './S.svg'
// import { FaSoundcloud } from 'react-icons/fa/brands'
const mainLogo = process.env.PUBLIC_URL + '/bellcurve-white.png'

export default function InfoPanel(props){
	const { scRef } = props
	const trackTitle = useStore((state) => state.trackTitle)

  const links = {
    'sc' : 'https://soundcloud.com/bell_curve',
    'insta' : 'https://www.instagram.com/bell.curve',
    'twitter' : 'https://twitter.com/isabellcurve',
    'symbios' : 'https://www.symbios.wiki/',
    'bandcamp' : 'https://bellcurve.bandcamp.com/album/deep-end',
  }

  const openPage = (url) => {
    window.open(url, "_blank")
  }

	return (
    	<div className="INFO">
      
        {/*<div className="INFO-block1">
          <div className="TITLE"> DEEP END </div>
        </div>*/}
        <div className="INFO-block2">
          <div className="Playing"> {
          	trackTitle ? "Now Playing:" : "Click A Balloon To Start"
          } </div>
          <div className="TrackInfo"> {trackTitle} </div>
        </div>
        <div className="LINKS">
          <img className="main-logo" src={mainLogo} />
          <IconContext.Provider value={{size: 42}}>
            <FaBandcamp
              className="fa-lg" 
              onClick={() => openPage(links.bandcamp)}
            />
          	<FaSoundcloud
              className="fa-lg" 
              onClick={() => openPage(links.sc)}
            /> 
            <FaInstagram
              className="fa-lg" 
              onClick={() => openPage(links.insta)}
            /> 
            <S
              onClick={() => openPage(links.symbios)}
            />
          </IconContext.Provider>
        </div>
    </div>
	)
}