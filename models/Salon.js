// models/salons.js - Модель салонов красоты
const mongoose = require('mongoose');

const SalonSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Название салона обязательно'] 
    }, // Название салона
    
    address: { 
        type: String, 
        required: [true, 'Адрес салона обязателен'] 
    }, // Адрес
    
    services: [{ 
        type: String 
    }], // Список услуг (названия)
    
    rating: { 
        type: Number, 
        default: 0,
        min: 0,
        max: 5
    }, // Рейтинг от 0 до 5
    
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }, // ID владельца салона
    
    salonPhotoUrl: { 
        type: String 
    }, // URL фотографии салона
    
    // === НОВЫЕ ПОЛЯ ДЛЯ КАРТЫ ===
    coordinates: {
        lat: { type: Number, default: 41.7151 }, // Тбилиси по умолчанию
        lng: { type: Number, default: 44.8271 }
    },
    
    phone: { type: String, default: '' }, // Телефон салона
    
    googleMapsPlaceId: { type: String, default: '' }, // ID из Google Maps
    googleMapsRating: { type: Number, default: 0 },
    googleMapsReviews: { type: Number, default: 0 },
    googleMapsPhotos: [{ type: String }], // URLs фото из Google Maps
    
    photos: [{ type: String }], // Собственные фото салона
    
    videos: [{ type: String }], // Видео салона
    
    gallery: [{
      type: { type: String, enum: ['photo', 'video'], default: 'photo' },
      url: { type: String, required: true },
      caption: { type: String },
      createdAt: { type: Date, default: Date.now }
    }], // Галерея медиа салона
    
    workingHours: {
        monday: { type: mongoose.Schema.Types.Mixed, default: '10:00-20:00' },
        tuesday: { type: mongoose.Schema.Types.Mixed, default: '10:00-20:00' },
        wednesday: { type: mongoose.Schema.Types.Mixed, default: '10:00-20:00' },
        thursday: { type: mongoose.Schema.Types.Mixed, default: '10:00-20:00' },
        friday: { type: mongoose.Schema.Types.Mixed, default: '10:00-20:00' },
        saturday: { type: mongoose.Schema.Types.Mixed, default: '10:00-18:00' },
        sunday: { type: mongoose.Schema.Types.Mixed, default: 'დახურულია' }
    },
    
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userName: { type: String },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String, maxlength: 500 },
        createdAt: { type: Date, default: Date.now }
    }],
    
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    
    description: { type: String, default: '' }, // Описание салона
    
    categories: [{ type: String }], // Категории услуг: nails, hair, face, body, makeup
    
    isActive: { type: Boolean, default: true } // Активен ли салон
    
}, { timestamps: true }); // Добавляет createdAt и updatedAt

// Индекс для геопоиска
SalonSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });

module.exports = mongoose.model('Salon', SalonSchema);