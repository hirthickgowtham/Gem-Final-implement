

const Admin_Logout = (req,res)=>{
    res.clearCookie("adminToken");
    res.json({ message: "Logged out successfully" });
}

export default {Admin_Logout}