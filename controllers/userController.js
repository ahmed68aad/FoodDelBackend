import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//login user
const loginUser = async (request, response) => {
  const { email, password } = request.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return response.json({
        success: false,
        message: "User Not Exist",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.json({
        success: false,
        message: "invalid Credentials",
      });
    }

    const token = createToken(user._id);

    return response.json({ success: true, token });
  } catch (error) {
    console.log(error);
    response.json({
      success: false,
      message: "Error",
    });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
//register user
const registerUser = async (request, response) => {
  const { name, password, email } = request.body;
  try {
    // Check if the user exists
    const exist = await userModel.findOne({ email });
    if (exist) {
      return response.json({
        success: false,
        message: "User Already Exist",
      });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return response.json({
        success: false,
        message: "Please Enter Valid Email",
      });
    }

    // Validate password
    if (password.length < 8) {
      return response.json({
        success: false,
        message: "Please Enter Strong Password",
      });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // Create token and send response
    const token = createToken(user._id);
    return response.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);

    // Send error response
    return response.json({
      success: false,
      message: "Error",
    });
  }
};

export { loginUser, registerUser };
