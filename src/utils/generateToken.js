import jwt from 'jsonwebtoken'

const generateToken = (id, expiresIn) => {
  return jwt.sign({userID:id}, process.env.JWT_SECRET, {expiresIn});
};

export {generateToken as default}