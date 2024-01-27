const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (process.env.NODE_ENV !== "test") {
      // Verifica si el usuario actual está autenticado
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verifica si el rol del usuario actual está permitido

      const userRole = req.session.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } else {
      //omito validaciones en un entorno de prueba
      next();
    }
  };
};
export default authorize;
