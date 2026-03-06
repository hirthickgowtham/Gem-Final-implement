import bcrypt from "bcrypt";

const Verify_Admin = async (username, password) => {

    if (username !== process.env.USER_NAME) {
        return false;
    }

    const isMatch = await bcrypt.compare(
        password,
        process.env.HASHED_PASSWORD
    );

    return isMatch;
};

export default { Verify_Admin };
