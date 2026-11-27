const jwt = require("jsonwebtoken");

function verificarToken(req, res, next){
    const authHeader = req.headers["authorization"] || "";
    const [esquema, token] = authHeader.split(" ");

    if (esquema !== "Bearer" || !token) {
        return res.status(401).json({ error: "Token de autenticación requerido"});
    }

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        return next();
    } catch (err){
        return res.status(401).json({ error: "Token inválido o expirado"});
    }
}

function autorizarRoles(...rolesPermitidos){
    return (req, res, next) => {
        if(!rolesPermitidos.includes(req.user.rol)){
            return res.status(401).json({ error : "Accesso denegado: rol sin permisos"});
        }

        return next();
    };
}

module.exports = {
    verificarToken,
    autorizarRoles,
};