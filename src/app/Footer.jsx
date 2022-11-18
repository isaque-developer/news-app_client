export default ({ content: { footer: { dev, href, links }, images }}) =>
    <footer>
        <h6>
            <a href={ href } target="_blank">{ dev }</a>
        </h6>
        <div></div>
        {
            links.map(({ href, name }) => <a href={ href } key={ name } target="_blank">
                <img src={ images[ name ] } alt={ name }/>
            </a> )
        }
    </footer>