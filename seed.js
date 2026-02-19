// seed.js - Наполнение базы данных (на грузинском языке)
require('dotenv').config();
const mongoose = require('mongoose');
const Package = require('./models/Package');
const Salon = require('./models/Salon');
const Service = require('./models/Service');
const User = require('./models/User');

console.log('🌱 ვიწყებთ ბაზის შევსებას...');

// Данные для наполнения
const packages = [
    { 
        plan: 'ბაზისიური', 
        price: 99, 
        tokens: 100, 
        description: 'იდეალურია დამწყებთათვის', 
        features: ['100 ტოკენი', 'ყველა პარტნიორი სალონი', 'უფასო გაუქმება'],
        perks: ['24/7 მხარდაჭერა']
    },
    { 
        plan: 'სტანდარტული', 
        price: 179, 
        tokens: 200, 
        description: 'ყველაზე პოპულარული', 
        features: ['200 ტოკენი', 'ყველა პარტნიორი სალონი', 'უფასო გაუქმება', 'პრიორიტეტული მხარდაჭერა'],
        perks: ['24/7 მხარდაჭერა', 'პირადი მენეჯერი'],
        popular: true 
    },
    { 
        plan: 'პრემიუმი', 
        price: 299, 
        tokens: 350, 
        description: 'უსაზღვრო სილამაზე', 
        features: ['350 ტოკენი', 'ყველა პარტნიორი სალონი', 'უფასო გაუქმება', 'პრიორიტეტული მხარდაჭერა', 'VIP მომსახურებები'],
        perks: ['24/7 მხარდაჭერა', 'პირადი მენეჯერი', 'VIP წვდომა']
    }
];

const salons = [
    { 
        name: 'Elegance Beauty', 
        services: ['მანიკური', 'პედიკური', 'ვარცხნილობა'], 
        address: 'ვაკე, ჭავჭავაძის 12', 
        rating: 4.8 
    },
    { 
        name: 'Royal Spa', 
        services: ['კოსმეტოლოგია', 'მასაჟი', 'სახის მოვლა'], 
        address: 'საბურთალო, კოსტავას 45', 
        rating: 4.9 
    },
    { 
        name: 'Glamour Studio', 
        services: ['ვარცხნილობა', 'მანიკური', 'მაკიაჟი'], 
        address: 'ისანი, გორგასლის 23', 
        rating: 4.7 
    },
    { 
        name: 'Beauty Zone', 
        services: ['კოსმეტოლოგია', 'ეპილაცია', 'სახის მოვლა'], 
        address: 'ვაკე, აბაშიძის 8', 
        rating: 4.6 
    }
];

// Создаем владельца салона для услуг
const createSalonOwner = async (salonName) => {
    try {
        const owner = new User({
            firstName: 'მფლობელი',
            lastName: 'სალონის',
            login: `${salonName.toLowerCase().replace(/\s+/g, '_')}_owner`,
            email: `${salonName.toLowerCase().replace(/\s+/g, '_')}@beautypass.ge`,
            password: 'owner123456', // Временный пароль
            phone: '+99550000000',
            userType: 'salon',
            isAdmin: false,
            isEmailVerified: true,
            balance: 0
        });
        
        await owner.save();
        console.log(`✅ შექმნილია მფლობელი სალონისთვის "${salonName}":`, owner._id);
        return owner._id;
    } catch (error) {
        console.error(`❌ შეცდომა მფლობელის შექმნისას "${salonName}":`, error);
        return null;
    }
};

// Услуги с ВСЕМИ обязательными полями
const services = [
    { 
        name: 'კლასიკური მანიკური', 
        category: 'ფრჩხილები', 
        bpPrice: 50, 
        price: 120, // Добавлено поле price в GEL
        durationMinutes: 60 
    },
    { 
        name: 'ვარცხნილობასთან ერთად თმის შეჭრა', 
        category: 'თმა', 
        bpPrice: 80, 
        price: 180, // Добавлено поле price в GEL
        durationMinutes: 90 
    },
    { 
        name: 'წარბების კორექცია', 
        category: 'წარბები', 
        bpPrice: 40, 
        price: 80, // Добавлено поле price в GEL
        durationMinutes: 30 
    },
    { 
        name: 'კლასიკური მასაჟი', 
        category: 'მასაჟი', 
        bpPrice: 100, 
        price: 200, // Добавлено поле price в GEL
        durationMinutes: 60 
    },
    { 
        name: 'საღამოს მაკიაჟი', 
        category: 'მაკიაჟი', 
        bpPrice: 70, 
        price: 150, // Добавлено поле price в GEL
        durationMinutes: 45 
    },
    { 
        name: 'SPA-მოვლა', 
        category: 'SPA', 
        bpPrice: 150, 
        price: 300, // Добавлено поле price в GEL
        durationMinutes: 120 
    },
    { 
        name: 'კლასიკური პედიკური', 
        category: 'პედიკური', 
        bpPrice: 60, 
        price: 120, // Добавлено поле price в GEL
        durationMinutes: 60 
    }
];

// Функция наполнения БД
const seedDB = async () => {
    try {
        console.log('🔗 დაკავშირება MongoDB-სთან...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB დაკავშირულია');

        // Очищаем коллекции
        console.log('🗑️ ძველი მონაცემების წაშლა...');
        await Package.deleteMany({});
        await Salon.deleteMany({});
        await Service.deleteMany({});
        await User.deleteMany({});
        console.log('✅ მონაცემები წაშლილია');

        // Наполняем пакеты
        console.log('📦 პაკეტების დამატება...');
        await Package.insertMany(packages);
        console.log(`✅ დამატებულია ${packages.length} პაკეტი`);

        // Наполняем салоны с владельцами
        console.log('🏢 სალონების დამატება...');
        const salonsWithOwners = [];
        
        for (const salonData of salons) {
            const ownerId = await createSalonOwner(salonData.name);
            if (ownerId) {
                const salonWithOwner = {
                    ...salonData,
                    ownerId: ownerId
                };
                salonsWithOwners.push(salonWithOwner);
            }
        }
        
        await Salon.insertMany(salonsWithOwners);
        console.log(`✅ დამატებულია ${salonsWithOwners.length} სალონი მფლობელებთან ერთად`);

        // Наполняем услуги с привязкой к владельцам
        console.log('💅 მომსახურებების დამატება...');
        const servicesWithOwners = [];
        
        // Создаем соответствие услуг для каждого салона
        const servicesBySalon = {
            'Elegance Beauty': ['კლასიკური მანიკური', 'პედიკური'],
            'Royal Spa': ['კოსმეტოლოგია', 'მასაჟი', 'სახის მოვლა'],
            'Glamour Studio': ['ვარცხნილობასთან ერთად თმის შეჭრა', 'მანიკური', 'მაკიაჟი'],
            'Beauty Zone': ['კოსმეტოლოგია', 'ეპილაცია', 'სახის მოვლა']
        };

        for (const [salonName, serviceNames] of Object.entries(servicesBySalon)) {
            console.log(`🏢 ვამუშავებთ სალონს: ${salonName}`);
            const salon = salonsWithOwners.find(s => s.name === salonName);
            if (salon && salon.ownerId) {
                console.log(`  მფლობელი: ${salon.ownerId}`);
                for (const serviceName of serviceNames) {
                    const serviceData = services.find(s => s.name === serviceName);
                    if (serviceData) {
                        const serviceWithOwner = {
                            ...serviceData,
                            ownerId: salon.ownerId
                        };
                        servicesWithOwners.push(serviceWithOwner);
                        console.log(`    + მომსახურება: ${serviceName}`);
                    } else {
                        console.log(`    ❌ მომსახურება "${serviceName}" არ მოიძებნა მომსახურებების სიაში`);
                    }
                }
            } else {
                console.log(`  ❌ სალონი "${salonName}" არ მოიძებნა ან არავინ მფლობელი`);
            }
        }

        console.log(`სულ დასამატებელი მომსახურებები: ${servicesWithOwners.length}`);
        await Service.insertMany(servicesWithOwners);
        console.log(`✅ დამატებულია ${servicesWithOwners.length} მომსახურება მფლობელებთან ერთად`);

        console.log('🎉 ბაზა წარმატებით შეივსო!');

    } catch (error) {
        console.error('❌ ბაზის შევსების შეცდომა:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 დაკავშირი ბაზასთან დახურულია');
        process.exit(0);
    }
};

// Запускаем наполнение
seedDB();