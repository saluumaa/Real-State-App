import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma.js"
export const register = async (req, res) => {  
   const {username, email, password} = req.body
    try{
    //hash password
    const hashedPassword = await bcryptjs.hash(password, 10)
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        },
    })
    console.log(newUser)
    res.status(201).json({message: "User created"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "failed to create user"})
    }
}

export const login = async (req, res) => {
    const {username, password} = req.body
    try{
        //check if user exists
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })
        if(!user){
            return res.status(401).json({message: "Invalid credentials"})
        }
        //check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return res.status(401).json({message: "Invalid credentials"})
        }
        //send token
        const token = jwt.sign({id: user.id, isAdmin: true}, process.env.JWT_SECRET, {expiresIn: "1w"})
        const {password: userPassword, ...userInfo} = user
        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            // sameSite: "none"
        }).status(200).json(userInfo)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "failed to login"})
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token").status(200).json({message: "Logged out successfully"})
}