import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { render as renderReturn } from '../data/classifyReturn'

export default ({ logo, screen: { maxScreen, minScreen }, search: { request, searchImg }}) => {

    const   [ menu, stateMenu ] = useState( 'none' ),
            [ findValue, setFind ] = useState(),
            [ list, stateList ] = useState( 'none' ),
            [ ulList, setList ] = useState(),
            [ screenImg, stateScreen ] = useState( maxScreen ),
            device = {
                mobile: /Android|BB|Pad|Phone/.test(navigator.userAgent),
                angle: screen.orientation.angle,
                height: innerHeight,
                width: innerWidth,
                refresh: true
            },
            resizeH = () => { setTimeout(() => {
                if( device.refresh ) {
                    device.angle = screen.orientation.angle
                    device.height = innerHeight
                    device.width = innerWidth
                }
                document.querySelector( ':root' )?.style.setProperty( '--all-height', `${
                    !device.refresh && device.angle != screen.orientation.angle
                        ? device.width
                        : device.height
                }px` )
            }, 200 )}

    useEffect(() => {

        document.onkeydown = ({ key: k }) => {

            if( k == 'Escape' && document.querySelector('#menu')?.style.display != 'none' )
                stateMenu( 'none' )
        }

        document.body.onfullscreenchange = () => {

            stateScreen( document.fullscreenElement ? minScreen : maxScreen )
        }

        document.body.onclick = e => {

            if( document.querySelector('#menu')?.style.display != 'none' ) {

                let a, b, m
                e.composedPath()?.forEach(({ className, id }) => {

                    if( className == 'menu' ) a = true
                    if( id == 'btMenu' ) b = true
                    if( id == 'menu' ) m = true
                })

                if( a || !b && !m ) stateMenu( 'none' )
            }
        }

        renderReturn.list = ({ error, response }) => setList( !error && <div>{
                response?.length && response?.map(({ _id: id, title }) => <Link key={ id }
                className="search" onClick={ () => stateList( 'none' )} to={ `/headline/${ id }`
                } onKeyUp={({ key, target: { nextSibling: n, previousSibling: p }}) => {
                    if( key == 'Escape' ) {
                        document.querySelector('[type=search]')?.focus()
                        stateList( 'none' )
                    }
                    if( key == 'ArrowDown' ) ( n || document.querySelector('a.search'))?.focus()
                    if( key == 'ArrowUp' ) ( p || document.querySelector('a.search:last-of-type'))?.focus()
                }}>{ title }</Link> ) || <span style={{ color: '#0007', fontSize: 'x-small' }}>
                    Sem sugestão
                </span>
            }</div>
        )

        if( device.mobile ) {
            resizeH()
            document.body.onfullscreenchange = () => { resizeH() }
            screen.orientation.onchange = () => { resizeH() }
        }
    }, [])

    useEffect(() => {

        findValue && request( 'find', true, 'title', {
            title: { $regex: findValue, $options: 'i' }
        }, 'list' )

    }, [ findValue ])

    return <header>

        <Link id="logo" to="/">
            <img src={ logo } alt="Logo"/>
        </Link>

        <div onBlur={ e => !(e?.relatedTarget?.className.indexOf('search') >= 0) && stateList( 'none' )}
            id="divSearch" style={{ boxShadow: list == 'none' ? '0 0 3px #0005' : list }}>
            <img src={ searchImg }/>
            <input type="search" onKeyUp={ ({ key, target: { value: v }}) => {
                const value = v.trim()
                stateList( key == 'Escape' || !value ? 'none' : 'initial' )
                if( document.querySelector( 'a.search' )) {
                    if( key == 'ArrowDown' ) document.querySelector('a.search')?.focus()
                    if( key == 'ArrowUp' ) document.querySelector('a.search:last-of-type')?.focus()
                }
                if( value && key == 'Enter' ) location.href = `/search/${ value }`
                else setFind( value )
            }} onFocus={ ({ target: { value }}) => {
                value && stateList( 'initial' )
                device.refresh = false
            }} onBlur={ () => { setTimeout(() => { device.refresh = true }, 100 )}}/>
            <div id="searchList" style={{ display: list }}>{ ulList }</div>
        </div>

        <div>
            <button id="btMenu" onClick={ () => stateMenu( menu == 'none' ? 'grid' : 'none' ) }>
                { menu == 'none' ? '☰' : '✖' }
            </button>
            <menu id="menu" style={{ display: menu }}>{
                [[ '/login', 'Login / Cadastro' ], [ '/registernews', 'Cadastrar Notícia' ]]
                    .map(([ to, name ]) => <li key={ to }>
                        <Link className="menu" to={ to }>{ name }</Link>
                    </li> )
            }</menu>
            <div>
                <button onClick={ () => {

                    if( document.fullscreenElement ) document.exitFullscreen()
                    else document.querySelector( 'body' )?.requestFullscreen()

                }}><img src={ screenImg }/></button>
            </div>
        </div>

    </header>
}