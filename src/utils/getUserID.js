import jwt from 'jsonwebtoken'

const getUserID = (req, requireAuth = true) => {
  const header = req.request.headers.authorization;
  if (header) {
    const token = header.replace('Bearer ','');
    const dec = jwt.verify(token, 'ThisIsULTRAsecreT');
    return dec.userID;
  }
  if (requireAuth)  throw new Error('Authentication required');
  return null;
};

export {getUserID as default}