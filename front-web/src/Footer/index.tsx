import './styles.css';
import { ReactComponent as LinkedinIcon} from './linkedin.svg';
import { ReactComponent as YouTubeIcon} from './youtube.svg';
import { ReactComponent as InstagramdIcon} from './instagram.svg';


function Footer(){
    return(
       <footer className="main-footer">
           App desenvolvido durante a 2ª ed. do evento Semana DevSuperior
           <div className="footer-icons">
               <a href="https://www.youtube.com/channel/UCHAth10P72TLnAcACECzVgg" target="_new">
                <YouTubeIcon />
               </a>
               <a href="https://www.linkedin.com/in/marcelo-caldas-/" target="_new">
                <LinkedinIcon />
               </a>
               <a href="https://www.instagram.com/marcelocaldasdevops/" target="_new">
                <InstagramdIcon />
               </a>
           </div>
       </footer>
    )

}

export default Footer;