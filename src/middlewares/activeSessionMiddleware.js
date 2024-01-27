export const activeSession = (req, res, next) => {

    if (process.env.NODE_ENV !== "test"){
      if (!req.isAuthenticated()) {
        return res.redirect("/api/sessions/login");
      }
  
      next();
    }else{
      next();
    }
  };