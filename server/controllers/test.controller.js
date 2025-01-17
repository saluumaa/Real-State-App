import jwt from 'jsonwebtoken';
export const shouldBeLoggedIn = (req, res) => {
    console.log(req.userId)
        res.status(200).json({message: "You are Authenticated"})    
    

}

export const shouldBeAdmin = (req, res) => {   
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: "Not Authenticated"})
        jwt.verify(token, process.env.JWT_SECRET, async(err, user) => {
        if(err){ return res.status(403).json({message: "Token is not valid"})}
        if(!user.isAdmin){ return res.status(403).json({message: "Not Authorized"})}        
        })
        res.status(200).json({message: "You are Authenticated"})    
    }
}