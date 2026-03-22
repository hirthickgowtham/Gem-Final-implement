import jwt from "jsonwebtoken";
import Login_Service from "../services/Login.service.js";

const Admin_Login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password required"
            });
        }

        const result = await Login_Service.Verify_Admin(username, password);

        if (!result) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { role: "admin", username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login success",
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export default { Admin_Login };
