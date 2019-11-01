import Auth from '../utils/Auth';

const User = {
  email(parent, args, { request }, info) {
    const userId = Auth(request, false);
    if (userId && userId === parent.id) {
      return parent.email;
    } else {
      return null;
    }
  }
};

//! now we did not have that because we add info in prisma.query
export { User as default };
