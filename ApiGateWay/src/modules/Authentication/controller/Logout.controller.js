

const Admin_Logout = (req,res)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if (token) blacklistedTokens.add(token);

    res.json({ message: "Logged out" });
}

export default {Admin_Logout}