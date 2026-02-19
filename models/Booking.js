// models/booking.js - Модель бронирований с QR-кодом
const mongoose = require('mongoose');
const crypto = require('crypto');

const BookingSchema = new mongoose.Schema({
    // Уникальный код бронирования для QR
    bookingCode: {
        type: String,
        unique: true,
        sparse: true
    },
    
    // Клиент
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'ID клиента обязателен'] 
    },
    
    clientName: {
        type: String,
        required: true
    },
    
    clientEmail: {
        type: String,
        required: true
    },
    
    clientPhone: {
        type: String
    },
    
    // Салон
    salonId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, 'ID салона обязателен'] 
    },
    
    salonName: { 
        type: String, 
        required: [true, 'Название салона обязательно'] 
    },
    
    // Слот и услуга
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot'
    },
    
    serviceName: { 
        type: String, 
        required: [true, 'Услуга обязательна'] 
    },
    
    serviceCategory: {
        type: String
    },
    
    // Специалист
    specialistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialist'
    },
    
    specialistName: {
        type: String
    },
    
    // Дата и время
    date: {
        type: String,
        required: true
    }, // YYYY-MM-DD
    
    time: {
        type: String,
        required: true
    }, // HH:MM
    
    dateTime: { 
        type: Date, 
        required: [true, 'Дата и время обязательны'] 
    },
    
    duration: {
        type: Number,
        default: 30
    },
    
    // Цена
    bpPrice: {
        type: Number,
        default: 0
    },
    
    // Финансовые статусы
    paymentStatus: {
        type: String,
        enum: ['escrow', 'released', 'refunded'],
        default: 'escrow'
    },
    // escrow - BP списаны у клиента, ждут подтверждения
    // released - BP переданы салону (после QR сканирования)
    // refunded - BP возвращены клиенту (отмена)
    
    // Статусы
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'], 
        default: 'pending' 
    },
    // pending - ожидает (клиент придёт)
    // confirmed - подтверждено салоном (QR отсканирован)
    // completed - услуга оказана
    // cancelled - отменено
    // no-show - клиент не пришел
    
    qrScannedAt: {
        type: Date
    },
    
    confirmedAt: {
        type: Date
    },
    
    confirmedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    completedAt: {
        type: Date
    },
    
    notes: {
        type: String
    }
    
}, { timestamps: true });

// Генерация уникального кода бронирования
BookingSchema.statics.generateBookingCode = function() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `BP-${timestamp}-${random}`;
};

// Индексы
BookingSchema.index({ salonId: 1, date: 1 });
BookingSchema.index({ userId: 1 });
BookingSchema.index({ bookingCode: 1 });
BookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', BookingSchema);