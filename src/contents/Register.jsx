import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { render as renderReturn } from '../data/classifyReturn'
import { getForm, getImages } from '../data/request.mjs'
import { response as msgTime } from '../others/config.mjs'
import loading from '../images/loading.svg'

export default ({ content: { content, min_length, synopsis }}) => {

    const nav = useNavigate(),
    [ register, setRegister ] = useState(),
    [ btnTrash, setBtnTrash ] = useState( 'none' ),
    [ images, setImages ] = useState({ ul: null, value: '' }),
    [ cover, setCover ] = useState({ background: '#999', text: 'Sem imagem', value: '' })

    const getCoverDOM = async ({ target: t }) => {

        const img = await getImages( t.files )

        setCover({

            background: img ? `url(${ img[0] }) center / cover` : '#999',
            text: img ? '' : 'Sem imagem',
            value: img ? JSON.stringify({ img }) : ''
        })

        !img && ( t.value = '' )
    }

    const getImagesDOM = async ( files, update ) => {

        const img = !update && await getImages( files ), all = !update && images.value && img
            ? JSON.parse( images.value )?.img?.concat( img )
            : null;

        ( update && files || all || img ) && setImages({

            ul: <ul>{
                ( update && files || all || img )?.map(( i, k ) => <li
                    key={ k } data-index={ k }
                    onClick={({ target: { firstChild: c }}) => c?.click() }
                    style={{ background: `url(${ i }) center / cover` }}>
                    <input onChange={({ target }) => setBtnTrash(
                            Boolean( target.closest('ul')?.querySelectorAll(':checked')?.length )
                                ? 'flex'
                                : 'none'
                        )} type="checkbox"
                    />
                </li> )
            }</ul>,

            value: JSON.stringify({ img: update && files || all || img })
        })
    }

    useEffect(() => {

        if( !localStorage.auth ) {

            renderReturn.fromURL = location.pathname
            nav('/login')
        }

        renderReturn.registernews = ({ error, response }) => {

            setRegister( <h4 className={ `${ error ? 'error' : 'success' } response` }>
                    { error ? response : '✓' }
                </h4> )

            if( !error ) {

                setTimeout(() => document.querySelector('#logo').click(),
                    msgTime.message_time
                )
            }
        }
    }, [])

    return localStorage.auth && <form id="registernews" onSubmit={ e => {
        getForm( e )
        setRegister( <span className="response"
            style={{ height: `${ document.querySelector('#registernews')?.scrollHeight }px` }}
        ><img src={ loading }/></span> )
    }}>
        <input autoFocus minLength={ min_length } name="title" placeholder="Título" required type="text"/>
        <input
            name="category"
            pattern={ `[ $0-9A-Za-z_-]{${ min_length },30}` }
            placeholder="Categoria"
            required
            title={ 'Aceito somente os seguintes caracteres: "A-z", "0-9" e "-$_"' }
            type="text"
        />
        <textarea
            name="synopsis"
            maxLength={ synopsis }
            minLength={ min_length }
            placeholder={ `Resumo da notícia (até ${ synopsis } caracteres).` }
            required
        ></textarea>
        <textarea
            name="content"
            maxLength={ content }
            minLength={ min_length }
            placeholder={ `Conteúdo da notícia (até ${ content } caracteres).` }
            required
        ></textarea>
        <section className="images">
            <div className="image" data-response={ cover.text } style={{ background: cover.background }}>
                <input name="cover" type="hidden" value={ cover.value }/>
                <input accept="image/*" onChange={ getCoverDOM } type="file"/>
            </div>
            <div className="image" onDragOver={ e => e.preventDefault() } onDrop={ e => {
                e.preventDefault()
                getImagesDOM( e.dataTransfer.files )
            }}>
                <input name="images" type="hidden" value={ images.value }/>
                { images.ul }
                <button onClick={ ({ target: { parentNode: p }}) => {
                    const v = [ ... p?.querySelectorAll(':checked') ]
                        ?.map( e => {
                            e.click()
                            return e?.parentNode?.dataset?.index
                        })
                    v?.length && getImagesDOM(
                        JSON.parse( images.value )?.img
                        ?.filter(( e, i ) => !v.find( f => f == i )),
                        true )
                }} style={{ display: btnTrash }} type="button">
                </button>
                <button onClick={ () => {
                    const ipt = document.createElement('input')
                    ipt.type = 'file'
                    ipt.accept = 'image/*'
                    ipt.multiple = true
                    ipt.onchange = ({ target: { files }}) => getImagesDOM( files )
                    ipt.click()
                }} type="button">+</button>
            </div>
        </section>
        <button type="submit">Cadastrar</button>
        { register }
    </form>
}