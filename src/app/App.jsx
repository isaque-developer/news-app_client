import { Outlet } from 'react-router-dom'
import { footer } from '../others/config'
import { request } from '../data/request.mjs'
import images from '../others/footerImages'
import logo from '../images/logo.svg'
import maxScreen from '../images/maximize.svg'
import minScreen from '../images/minimize.svg'
import searchImg from '../images/search.svg'
import Header from './Header'
import Footer from './Footer'
import '../layout/layout.css'

export default () =>
  <>
    <Header logo={ logo } screen={{ maxScreen, minScreen }} search={{ request, searchImg }}/>
    <main>
      <Outlet/>
    </main>
    <Footer content={{ footer, images }}/>
  </>