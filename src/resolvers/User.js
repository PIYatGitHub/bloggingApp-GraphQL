import getUserID from '../utils/getUserID';

const User = {
  email(parent, args, {request}, info){
    const userID = getUserID(request, false);
     if (userID && parent.id===userID) return parent.email;
     else return null;
  }
};

export {User as default}