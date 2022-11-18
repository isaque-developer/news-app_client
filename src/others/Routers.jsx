import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { login, register_news } from './config.mjs'
import App from '../app/App'
import Headline from '../contents/Headline'
import Login from '../contents/Login'
import News from '../contents/News.jsx'
import Register from '../contents/Register'

export default () =>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={ <App/> }>
                <Route path="" element={ <News/> }/>
                <Route path="category/:category" element={ <News/> }/>
                <Route path="search/:find" element={ <News/> }/>
                <Route path="login" element={ <Login content={ login }/> }/>
                <Route path="headline/:id" element={ <Headline/> }/>
                <Route path="registernews" element={ <Register content={ register_news }/> }/>
            </Route>
            <Route path="*" element={ <h1>Not found!</h1> }/>
        </Routes>
    </BrowserRouter>