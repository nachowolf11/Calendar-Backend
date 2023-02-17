const { response } = require("express");
const Evento = require("../models/Evento");

const getEventos = async( req, res = response ) => {

    try {
        const eventos = await Evento.find().populate('user','name')

        res.status(200).json({
            ok: true,
            msg: eventos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el admin'
        });
    }
}

const crearEvento = async( req, res = response ) => {

    const evento = new Evento( req.body );

    try {
        evento.user = req.uid // Mediante el la validacion del token se asigna el UID al req
        const eventoGuardado = await evento.save();

        res.status(201).json({
            ok: true,
            evento: eventoGuardado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el admin'
        });
    }
}

const actualizarEvento = async( req, res = response ) => {

    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById( eventoId );
        const uid = req.uid

        if( !evento ){
            res.status(404).json({
                ok: false,
                msg:'El evento no existe por ese ID'
            });
        }

        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg:'No tiene privilegio de editar este evento.'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, {new: true } );
        res.status(201).json({
            ok: true,
            evento: eventoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el admin'
        });
    }
}

const eliminarEvento = async( req, res = response ) => {

    const eventoId = req.params.id;

    try {
        const evento = await Evento.findById( eventoId );
        const uid = req.uid

        if( !evento ){
            res.status(404).json({
                ok: false,
                msg:'El evento no existe por ese ID'
            });
        }

        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg:'No tiene privilegio de eliminar este evento.'
            });
        }

        const eventoEliminado = await Evento.findByIdAndDelete( eventoId );

        res.status(200).json({
            ok: true,
            eventoEliminado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el admin'
        });
    }
}

module.exports = {
    getEventos,
    eliminarEvento,
    crearEvento,
    actualizarEvento
}