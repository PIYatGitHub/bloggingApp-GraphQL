import jwt from 'jsonwebtoken'

const generateToken = (id, secret, expiresIn) => {
  return jwt.sign({userID:id}, secret, {expiresIn});
};

export {generateToken as default}