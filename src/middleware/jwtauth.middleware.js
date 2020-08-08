const jwt = require("jsonwebtoken");

function verifyToken(req, res, next){
    let {secTkn} = req.body;
    if(typeof(secTkn) !== "undefined") {
        let check = 1;
        jwt.verify(secTkn, process.env.JWT_SECRET_KEY, (err, data) => {
            if(err) {
                check = 0;
            }
        });
        if(check) {
            next();
        } else {
            res.send({status: 403, message: "Forbidden Access!"});
            return;
        }
    } else {
        res.send({status: 403, message: "Forbidden Access!"});
        return;
    }
}

module.exports = verifyToken;