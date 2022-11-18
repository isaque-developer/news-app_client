import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { render as renderReturn } from '../data/classifyReturn'
import { request } from '../data/request.mjs'
import loading from '../images/loading.svg'

let dataCall = true

export default () => {

    const [ news, setNews ] = useState( <img src={ loading }/> ), { category, find } = useParams()

    if( document.querySelector( 'div.loading' )) {

        const dspLoad = document.querySelector( 'div.loading' ).style
        dspLoad.display = dspLoad.display == '' ? 'flex' : ''
    }

    useEffect(() => {

        renderReturn.news = ({ error, response }) => {

            dataCall = false
            setNews( error ? <h2 className="error">{ response }</h2>
                : <>
                    <ul onWheel={({ deltaY: d, target: t }) => {
                        if( d != 0 ) t.closest('main')?.scrollBy( d, 0 )
                    }}>{ response?.map(({ _id: id, title, category, synopsis, cover }, key ) =>
                        <li key={ key } data-id={ id }>
                            <Link className="news" to={ `/headline/${ id }` }>
                                <h3>{ title ? title : 'Sem Título' }</h3>
                                <h4>{ category ? category : 'Sem categoria' }</h4>
                                <p>{ synopsis ? synopsis : 'Sinopse não disponível...' }</p>
                            </Link>
                            { cover && <style>
                                li[data-id="{ id }"]::before {
                                    `{ background: #aaa url('${ cover }') center / cover }`
                                }
                            </style> }
                        </li>)
                    }</ul>
                    <div className="loading">
                        <img src={ loading }/>
                    </div>
                </>
            )
            document.querySelector('a.news')?.focus()
        }
    }, [])

    if( dataCall ) request(
            'find',
            find || category,
            'title category synopsis cover',
            category && { category }
        )

    dataCall = true

    return news
}