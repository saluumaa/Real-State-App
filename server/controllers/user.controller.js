import prisma from "../lib/prisma.js";
import bcryptjs from "bcryptjs";

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get users" });
    }
};


export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const users = await prisma.user.findUnique({
            where: {
                id
            },
        });
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get user" });
    }
}

export const updateUser = async (req, res) => {
    const id =  req.params.id;
    const tokenUserId = req.userId;
    const {password, ...inputs} = req.body;
    if (id !== tokenUserId) {
        return res.status(403).json({ message: "You can update only your account" });
    }

    let updadatedPassword = null;
    let avatar = null;

    try {

        if (password) {
            updadatedPassword = await bcryptjs.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data:{
                ...inputs,
               ...(updadatedPassword && { password: updadatedPassword }),
               ...(avatar && { avatar})
            }       
    });
    const {password:userPassword, ...rest} = updatedUser;
    res.status(200).json(rest);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to update user" });
    }
}


export const deleteUser = async (req, res) => {
    const id =  req.params.id;
    const tokenUserId = req.userId;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "You can update only your account" });
    }

    try {
        await prisma.user.delete({
            where: {
                id
            },
        });
        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to delete user" });
    }
}

export const savePost = async (req, res) => {
   const postId = req.body.postId;
    const tokenUserId = req.userId;
    try {
        const savedPost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId: tokenUserId,
                    postId
                }
            }
        
        });
        if (savedPost) {
           await prisma.savedPost.delete({
               where: {
                   id: savedPost.id
               }
           });
           res.status(200).json({ message: "post removed from saved list" });
        }else {
            await prisma.savedPost.create({
                data: {
                    userId: tokenUserId,
                    postId
                }
            });
            res.status(200).json({ message: "post saved successfully" });
        }
        

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to delete user" });
    }
}