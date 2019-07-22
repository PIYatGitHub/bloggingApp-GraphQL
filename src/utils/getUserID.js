import jwt from 'jsonwebtoken'

const getUserID = (req) => {
  const header = req.request.headers.authorization;
  if (!header) throw new Error('Authentication required');
  const token = header.replace('Bearer ','');
  const dec = jwt.verify(token, 'ThisIsULTRAsecreT');
  return dec.userID;
};

export {getUserID as default}