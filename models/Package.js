// models/package.js - Модель тарифных пакетов
const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
    plan: { 
        type: String, 
        required: [true, 'Название плана обязательно'] 
    }, // Название тарифа: Basic, Standard, Premium
    
    price: { 
        type: Number, 
        required: [true, 'Цена обязательна'] 
    }, // Цена в GEL
    
    tokens: { 
        type: Number, 
        required: [true, 'Количество токенов обязательно'] 
    }, // Сколько токенов в пакете
    
    includes: [{ 
        type: String 
    }], // Какие категории услуг входят
    
    description: { 
        type: String, 
        required: [true, 'Описание обязательно'] 
    }, // Описание тарифа
    
    features: [String], // Фичи тарифа
    
    perks: [String], // Дополнительные преимущества
    
    popular: { 
        type: Boolean, 
        default: false 
    } // Популярный тариф или нет
    
}, { timestamps: true }); // Добавляет createdAt и updatedAt

module.exports = mongoose.model('Package', PackageSchema);