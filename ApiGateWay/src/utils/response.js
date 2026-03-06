const sendresponse = (
    res,
  statusCode,
  success,
  message,
  data = null,
  error = null
)=>{
    return res.status(statusCode).json({
        success,
        statusCode,
        message,
        data,
        error
    })
}

export default sendresponse;