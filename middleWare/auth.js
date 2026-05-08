import jwt from "jsonwebtoken";

const authMiddlewar = async (request, response, next) => {
  const { token } = request.headers;
  if (!token) {
    return response.json({
      success: false,
      message: "Not Authorized, Login Again",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    request.body.userId = tokenDecode.id;
    next();
  } catch (error) {
    console.log(error);
    response.json({
      success: fasle,
      message: "Error",
    });
  }
};

export default authMiddlewar;
