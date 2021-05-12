const { response, request } = require("express");
const { Producto } = require("../models");

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.body;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    })
}

// obtenerProducto - populate {}
const obtenerProducto = async (req = request, res = response) => {
    const query = { _id: req.params.id };

    const producto = await Producto.findById(query)
        .populate("usuario", 'nombre')
        .populate('categoria', 'nombre')

    res.json({
        producto
    })
}

const crearProducto = async (req, res = response) => {

    const { ...body } = req.body;
    const nombre = body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({ nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        ...body,
        usuario: req.usuario._id
    }

    const producto = new Producto(data);
    // Guardar DB
    await producto.save();

    res.status(201).json(producto);
}

// actualizarProducto 
const actualizarProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto);
}

// borrarProducto - estado: false
const borrarProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        producto
    })
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}