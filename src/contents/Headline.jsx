import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { render as renderReturn } from '../data/classifyReturn'
import { request } from '../data/request.mjs'
import loading from '../images/loading.svg'

export default () => {

    const [ headline, setHeadline ] = useState( <img src={ loading }/> ), { id } = useParams()

    useEffect(() => {

        renderReturn.headline = ({ error, response }) => {

            setHeadline( error ? <h2 className="error">{ response || 'Notícia não encontrada.' }</h2>
                : (({ title, category, content, images, createdAt: create, updatedAt: update }) => {

                    return <article className={ images?.length ? 'withImg' : 'withoutImg' }>
                        <h1>{ title }</h1>
                        <div>Categoria:
                            <Link to={ `/category/${ category }` }>{ category }</Link>
                        </div>
                        <span>{ `Postado em ${ new Date( create ).toLocaleString( [], {
                                dateStyle: 'short',
                                timeStyle: 'short'
                            }).replace( ':', 'h' ) + (
                                create != update ? ` - atualizado ${ new Date( update ).toLocaleString( [], {
                                    dateStyle: 'short',
                                    timeStyle: 'short'
                                }).replace( ':', 'h' )}` : ''
                            )}`
                        }</span>
                        {
                            content.split('\n').map(( c, i ) => {
                                const p = c.trim()
                                return p ? <p key={ i }>{ p }</p> : null
                            })
                        }
                        {
                            Boolean( images?.length ) && <div className='illustrations'>
                                <ul>
                                    { images.map(( e, i ) => <li key={ i } onClick={ () => {
                                        const div = document.createElement('div')
                                        const img = document.createElement('img')
                                        img.src = e
                                        img.style = `max-height: 90%;
                                            max-width: 90%;
                                            margin: auto;
                                            box-shadow: 0 0 10px #fffa;
                                            background: #fff`
                                        div.append( img )
                                        div.id = 'showFullImg'
                                        div.onclick = ({ target: t }) => t?.id == 'showFullImg' && t.remove()
                                        document.querySelector('#root')?.append(div)
                                        document.querySelector('#showFullImg').style = `
                                            position: fixed;
                                            display: flex;
                                            top: 0;
                                            height: 100vh;
                                            width: 100%;
                                            background: #000d;
                                            z-index: 100;`
                                    }} style={{
                                        background: `#aaa url(${e}) center / cover`
                                    }}></li> )}
                                </ul>
                            </div>
                        }
                    </article>
                })( response )
            )
        }
    }, [])
    
    useEffect(() => { request( 'find-id', id )}, [ id ])
    
    return headline
}