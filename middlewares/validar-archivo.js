const validarArchivosSubir = (req, res, next)=>{

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({ msg: 'No hay archivos que subir - valdiarArchivoSubir' });
    }

    next();
}

module.exports={
    validarArchivosSubir
}