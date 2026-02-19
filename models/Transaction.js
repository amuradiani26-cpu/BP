// models/transaction.js - Модель транзакций платежей
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    transactionId: { 
        type: String, 
        required: [true, 'ID транзакции обязателен'], 
        unique: true 
    }, // Уникальный ID платежа
    
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'ID пользователя обязателен'] 
    }, // Кто платит
    
    amount: { 
        type: Number, 
        required: [true, 'Сумма обязательна'] 
    }, // Сколько платит (в GEL)
    
    bank: { 
        type: String, 
        enum: ['tbc', 'bog'], 
        required: [true, 'Банк обязателен'] 
    }, // Через какой банк
    
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'], 
        default: 'pending' 
    }, // Статус платежа
    
    createdAt: { 
        type: Date, 
        default: Date.now 
    }, // Когда создана
    
    updatedAt: { 
        type: Date, 
        default: Date.now 
    } // Когда обновлена
    
}, { timestamps: true }); // Добавляет createdAt и updatedAt

module.exports = mongoose.model('Transaction', TransactionSchema);