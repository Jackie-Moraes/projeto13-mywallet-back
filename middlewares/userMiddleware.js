export async function validHeader(req, res, next) {
    const { authorization } = req.headers;
    if(!authorization) {
        return res.status(422).send("Header is missing.");
    }

    next();
}