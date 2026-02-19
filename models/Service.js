// models/service.js - Модель услуг
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Название услуги обязательно'] 
    }, // Название услуги
    
    description: { 
        type: String 
    }, // Описание услуги
    
    price: { 
        type: Number, 
        required: [true, 'Цена обязательна'] 
    }, // Цена в GEL (для админки)
    
    durationMinutes: { 
        type: Number, 
        required: [true, 'Длительность обязательна'] 
    }, // Длительность в минутах
    
    category: { 
        type: String, 
        required: [true, 'Категория обязательна'] 
    }, // Категория: Ногти, Волосы, Брови и т.д.
    
    bpPrice: { 
        type: Number, 
        required: [true, 'Цена в BP обязательна'] 
    }, // Цена в Beauty Points
    
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    } // Владелец услуги (салон)
    
}, { timestamps: true }); // Добавляет createdAt и updatedAt

module.exports = mongoose.model('Service', ServiceSchema);