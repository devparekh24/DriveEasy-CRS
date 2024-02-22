import loadingImg from '../../assets/loading.gif'

const Loader = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={loadingImg} alt="Loading..." />
        </div>
    )
}

export default Loader
