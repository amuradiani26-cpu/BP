// models/user.js - Модель пользователя
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // Основные данные
    firstName: { type: String }, // Имя
    lastName: { type: String },  // Фамилия
    login: { type: String, required: true, unique: true }, // Логин для входа
    email: { type: String, required: true, unique: true }, // Email
    password: { type: String, required: true }, // Пароль (будет зашифрован)
    phone: { type: String, required: true }, // Телефон
    birthDate: { type: Date }, // Дата рождения
    referralCode: { type: String, unique: true, sparse: true }, // Уникальный реферальный код (привязан к email)
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Кто пригласил этого пользователя
    referralCount: { type: Number, default: 0 }, // Сколько рефералов привел
    
    // Тип пользователя
    userType: { 
        type: String, 
        enum: ['client', 'salon', 'admin'], 
        default: 'client' 
    },
    isAdmin: { type: Boolean, default: false }, // Админ или нет
    
    // Верификация
    isEmailVerified: { type: Boolean, default: false }, // Подтверждена ли почта
    twoFACode: { type: String }, // Код для двухфакторной аутентификации
    twoFACodeExpires: { type: Date }, // Когда код истекает
    twoFAMethod: { type: String, enum: ['email', 'sms'], default: 'email' }, // Метод 2FA
    
    // Восстановление пароля
    resetPasswordCode: { type: String }, // Код для сброса пароля
    resetPasswordExpires: { type: Date }, // Когда код истекает
    
    // Безопасность
    isBanned: { type: Boolean, default: false }, // Заблокирован ли пользователь
    loginAttempts: { type: Number, default: 0 }, // Количество неудачных попыток входа
    lockUntil: { type: Date }, // До какого времени заблокирован вход
    
    // Финансы
    balance: { type: Number, default: 0 }, // Баланс в GEL (лари)
    beautyPoints: { type: Number, default: 0 }, // Beauty Points (BP) для услуг
    
    // Gamification
    xp: { type: Number, default: 0 }, // Experience points
    streak: { type: Number, default: 0 }, // Дней подряд
    lastActivity: { type: Date }, // Последняя активность для streak
    totalBookings: { type: Number, default: 0 }, // Общее количество бронирований
    achievements: [{ type: String }], // Разблокированные достижения
    
    // Активный пакет/тариф
    activePlan: {
        name: { type: String }, // Название плана: Basic, Premium, VIP
        purchasedAt: { type: Date }, // Когда куплен
        expiresAt: { type: Date }, // Когда истекает
        bpIncluded: { type: Number, default: 0 } // Сколько BP было в пакете
    },
    
    // История покупок
    purchases: [{
        id: { type: Number },
        type: { type: String }, // 'tariff' или 'balance'
        plan: { type: String }, // Название тарифа
        price: { type: Number }, // Цена
        includes: [String], // Что входит
        perks: [String], // Бонусы
        ts: { type: Date }, // Когда куплено
        valid_until: { type: Date } // До когда действует
    }],
    
    // Поля для владельцев салонов
    salonName: { type: String }, // Название салона
    address: { type: String }, // Адрес салона
    salonDescription: { type: String }, // Описание салона
    salonPhotoUrl: { type: String }, // Фото салона
    
    // Финансы салона
    salonRevenue: { type: Number, default: 0 }, // Заработанные BP (после подтверждения)
    salonPendingRevenue: { type: Number, default: 0 }, // BP в ожидании (escrow)
    salonTotalBookings: { type: Number, default: 0 }, // Всего бронирований
    salonCompletedBookings: { type: Number, default: 0 }, // Завершенных бронирований
    salonCancelledBookings: { type: Number, default: 0 }, // Отмененных бронирований
    salonWithdrawnRevenue: { type: Number, default: 0 } // Выведенные BP (выплачено)
}, { timestamps: true }); // Добавляет createdAt и updatedAt

// Автоматическое шифрование пароля перед сохранением
UserSchema.pre('save', async function(next) {
    // Если пароль не менялся - пропускаем
    if (!this.isModified('password')) return next();
    
    // Шифруем пароль
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);