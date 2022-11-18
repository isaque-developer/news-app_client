import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { render as renderReturn } from '../data/classifyReturn'
import { getForm } from '../data/request.mjs'
import { response as msgTime } from '../others/config.mjs'
import loading from '../images/loading.svg'

export default ({ content: {

    password_max_length, password_min_length, user_max_length, user_min_length

}}) => {

    const nav = useNavigate(),
    [ login, setLogin ] = useState(),
    [ formId, setFormId ] = useState( 'login' ),
    optForm = ({ target: { value }}) => setFormId( value ),
    optStyleActive = {
        background: `repeating-linear-gradient(90deg, ${ formId == 'login'
        ? '#aaa 0 calc(97% - 5px), #555' : '#555, #aaa calc(3% + 5px) 100%' })`,
        zIndex: 2
    },
    optStyleDefault = {
        background: '#eee',
        filter: 'drop-shadow(0 0 3px #222)',
        zIndex: 1
    }

    useEffect(() => {

        renderReturn.login = ({ error, response }) => {

            setLogin( <h4 className={ `${ error ? 'error' : 'success' } response` }>
                    { error ? response : '✓' }
                </h4> )

            if( !error ) {

                localStorage.setItem( 'auth', response )
                const url = renderReturn.fromURL || '/'
                delete renderReturn.fromURL
                setTimeout(() => nav( url ), msgTime.message_time )
            }
        }
    }, [])

    useEffect(() => { setLogin()}, [ formId ])
        
    return <div id="user">
        <button onClick={ optForm } style={ formId == 'login' ? optStyleActive : optStyleDefault } value="login">
            Login
        </button>
        <button onClick={ optForm } style={ formId == 'register' ? optStyleActive : optStyleDefault } value="register">
            Cadastrar
        </button>
        <form id={ formId } onSubmit={ e => {
            getForm( e )
            setLogin( <span className="response"><img src={ loading }/></span> )
        }}>
            <input
                autoFocus
                maxLength={ user_max_length }
                minLength={ user_min_length }
                name="username"
                placeholder="Usuário"
                required
                type="text"
            />
            <input
                maxLength={ password_max_length }
                minLength={ password_min_length }
                name="password"
                placeholder="Senha"
                required
                type="password"
            />
            {
                formId == 'register' && <select defaultValue={ "user" } name="type" required>
                    <option value="manager">Administrador</option>
                    <option value="assistant">Assistente</option>
                    <option value="moderator">Moderador</option>
                    <option value="user">Usuário</option>
                </select>
            }
            <button type="submit">{ formId == 'login' ? 'Entrar' : 'Cadastrar' }</button>
            { login }
        </form>
    </div>
}