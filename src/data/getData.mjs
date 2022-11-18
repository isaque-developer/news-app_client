import { data as config } from '../others/config.mjs'
import response from './classifyReturn.jsx'

let ws

const checkConnection = ( checkWs = ws ) => {

    return checkWs?.readyState === WebSocket.OPEN ? true : false
}

export const connect = ({ host, port, attempts } = config ) => new Promise(( resolve, reject ) => {

        if( checkConnection( ws )) resolve( ws )
        
        else if( !checkConnection( ws ) && attempts ) {
    
            ws = new WebSocket( `ws://${ host }:${ port }` )
            ws.onopen = ({ target }) => {

                attempts = config.attempts
                resolve( target )
            }
            ws.onmessage = ({ data }) => response( JSON.parse( data ))
            ws.onclose = () => reconnect( host, port, attempts )

        } else {

            //setTimeout(() => connect(), config.attemptsReset )

            reject( response({

                error: true,
                response: 'Não foi possível estabelecer conexão com a base de dados! Tente novamente mais tarde.'
            }))
        }
    })

const reconnect = ( host, port, attempts ) => {

    --attempts
    return setTimeout(() => connect({ host, port, attempts }), 10000 )
}

export const send = async ( type, model, data ) => {

    try {

        if( checkConnection() ) {

            ws.send( JSON.stringify({ type, model, data, auth: localStorage?.auth }))

        } else {

            ws = await connect()
            send( type, model, data )
        }
        
    } catch ( e ) {
        
        return response({ error: true, response: e })
    }
}