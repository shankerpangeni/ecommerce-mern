import jwt from 'jsonwebtoken';

export const isAuthenticated = async ( req , res , next) => {
    try {
        const token = cookies.token;
        if(!token){
            return res.status(404).json({
                message: 'Token is required',
                success: false,
            })
        };
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({
                message: 'Token verification wrong.'
            })
        }
        
        req.user = decoded.id;

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: ''
        })
    }
}