// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware для проверки аутентификации пользователя
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'ტოკენი არას, წვდომა აკრძალულია' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Находим пользователя в БД, чтобы иметь актуальные данные
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'მომხმარებელი არ მოიძებნა' });
    }
    
    req.user = user; // Добавляем информацию о пользователе в запрос
    next();
  } catch (error) {
    console.error('Ошибка аутентификации (невалидный токен):', error.message);
    return res.status(401).json({ message: 'არასწორი ტოკენი' });
  }
};

// Middleware для проверки, является ли пользователь администратором
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ message: 'Доступ запрещен: недостаточно прав' });
};

// Middleware для проверки, является ли пользователь владельцем салона
const salonOwnerMiddleware = (req, res, next) => {
  // authMiddleware уже исполнился и заполнил req.user
  if (req.user && req.user.userType === 'salon') {
    return next();
  }
  res.status(403).json({ message: 'Доступ запрещен: для владельцев салонов' });
};


module.exports = {
  authMiddleware,
  adminMiddleware,
  salonOwnerMiddleware
};