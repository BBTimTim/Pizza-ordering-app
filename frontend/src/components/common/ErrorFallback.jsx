const Errorfallback = ({error}) => {
    return(
        <div className="text-center px-2 py-8">
            <h1 className="text-base sm:text-4xl font-bold text-red-700">Error!! Az oldal betöltése sikertelen</h1>
            <p className="text-red-600">{error.message}</p>
        </div>
    )
}

export default Errorfallback;