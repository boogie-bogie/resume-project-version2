const jwt = require("jsonwebtoken");
const userModel = require("../prisma/index");

const authMiddleware = async function (req, res, next) {
  try {
    const { authorization } = req.cookies;
    if (!authorization) throw new Error("토큰이 존재하지 않습니다.");

    const [tokenType, token] = authorization.split(" ");

    if (tokenType !== "Bearer")
      throw new Error("Token 형식이 일치하지 않습니다.");

    const decodedValueByVerify = jwt.verify(token, "user-secret-key");
    const userId = decodedValueByVerify.userId;

    const user = await userModel.users.findFirst({
      where: { userId: +userId },
    });
    if (!user) {
      res.clearCookie("authorization");
      throw new Error("토큰 사용자가 존재하지 않습니다.");
    }
    req.user = user;

    next();
  } catch (error) {
    res.clearCookie("authorization");

    switch (error.name) {
      case "TokenExpiredError":
        return res.status(401).json({ message: "토큰이 만료되었습니다." });
      case "JsonWebTokenError":
        return res.status(401).json({ message: "토큰이 조작되었습니다." });
      default:
        return res
          .status(401)
          .json({ message: error.message ?? "비정상적인 요청입니다." });
    }
  }
};

module.exports = authMiddleware;