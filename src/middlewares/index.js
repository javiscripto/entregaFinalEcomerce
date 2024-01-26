import EErrors from "../error/enum.js";
export default(error, req, res, next)=>{
    console.log(error.cause);
    switch(error.code){
        case EErrors.INVALID_TYPES_ERROR:
            res.send({status:"error",error: error.message })
            break;
        case EErrors.NULL_UNDEFINED_FIELD_ERROR:
            res.send({status:"error", error: error.message})
            break;
        default:
            res.send({status: "error", eror:"unhandled error"})
    }
}