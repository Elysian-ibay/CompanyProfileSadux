const db = require('./models');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        await db.sequelize.sync({ alter: true }); // Using alter: true to update schema if needed

        const adminExists = await db.User.findOne({ where: { username: 'admin' } });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 8);
            await db.User.create({
                username: 'admin',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created: admin / admin123');
        } else {
            console.log('Admin user already exists');
        }

        // Seed Landing Content
        const contentExists = await db.LandingPageContent.findOne();
        if (!contentExists) {
            await db.LandingPageContent.create({
                hero_title: 'Sadulur Teknologi Indonesia',
                hero_subtitle: 'Innovate. Integrate. Inspire.',
                hero_description: 'Transforming businesses with cutting-edge management ecosystems. From Esports Tournaments to HR and POS solutions, SaduX empowers your digital journey.',
                feature_title: 'Our Ecosystem',
                cta_title: 'Ready to Transform Your Business?',
                cta_description: 'Join the SaduX network and experience the next generation of management software.'
            });
            console.log('Default content seeded');
        } else {
            // Optional: Update existing content to match new requirements if it exists
            await db.LandingPageContent.update({
                hero_title: 'Sadulur Teknologi Indonesia',
                hero_subtitle: 'Innovate. Integrate. Inspire.',
                hero_description: 'Transforming businesses with cutting-edge management ecosystems. From Esports Tournaments to HR and POS solutions, SaduX empowers your digital journey.',
                feature_title: 'Our Ecosystem',
                cta_title: 'Ready to Transform Your Business?',
                cta_description: 'Join the SaduX network and experience the next generation of management software.'
            }, { where: {} });
            console.log('Content updated');
        }

        // Seed Features
        const featuresCount = await db.Feature.count();
        if (featuresCount === 0) {
            await db.Feature.bulkCreate([
                { icon_name: 'Trophy', title: 'Tournament Management', description: 'Comprehensive esports tournament organization and bracket management.', order: 1 },
                { icon_name: 'Users', title: 'HR Management', description: 'Streamlined employee tracking, payroll, and performance analysis.', order: 2 },
                { icon_name: 'ShoppingBag', title: 'POS Integration', description: 'Unified Point of Sale systems linked directly with HR and Inventory.', order: 3 },
                { icon_name: 'Globe', title: 'LandingPages CMS', description: 'Dynamic content management for impactful digital presence.', order: 4 }
            ]);
            console.log('Features seeded');
        }

        // Seed Products
        const productsCount = await db.Product.count();
        if (productsCount === 0) {
            await db.Product.bulkCreate([
                {
                    name: 'Tournament Management System',
                    price: 'Contact Sales',
                    description: 'A complete platform for organizing, managing, and broadcasting esports tournaments. Features include automated brackets, team management, and live score updates.',
                    image: '/uploads/products/tournament.jpg', // Placeholder
                    tag: 'Esports',
                    link: 'https://tournament.sadux.my.id'
                },
                {
                    name: 'SaduX HRIS',
                    price: 'Subscription',
                    description: 'Human Resource Information System tailored for modern companies. Manage attendance, payroll, and recruitment in one unified dashboard.',
                    image: '/uploads/products/hr.jpg',
                    tag: 'Enterprise',
                    link: 'https://hr.sadux.my.id'
                },
                {
                    name: 'SaduX POS + HR',
                    price: 'Bundle',
                    description: 'The ultimate retail solution. Combine your sales data with employee performance metrics for powerful business insights.',
                    image: '/uploads/products/pos.jpg',
                    tag: 'Retail',
                    link: 'https://pos.sadux.my.id'
                },
                {
                    name: 'SaduX CMS',
                    price: 'License',
                    description: 'Flexible Landing Page CMS to manage your company profile and marketing content with ease.',
                    image: '/uploads/products/cms.jpg',
                    tag: 'Web',
                    link: 'https://cms.sadux.my.id'
                }
            ]);
            console.log('Products seeded');
        }

        // Seed Stats
        const statsCount = await db.Statistic.count();
        if (statsCount === 0) {
            await db.Statistic.bulkCreate([
                { value: '50+', label: 'Enterprise Clients', order: 1 },
                { value: '100+', label: 'Tournaments Powered', order: 2 },
                { value: '1M+', label: 'Transactions Processed', order: 3 },
                { value: '24/7', label: 'Dedicated Support', order: 4 }
            ]);
            console.log('Stats seeded');
        }

        // Seed Settings
        const settingsExists = await db.GeneralSetting.findOne();
        if (!settingsExists) {
            await db.GeneralSetting.create({
                site_title: 'SaduX - Company Profile', // Add generic title
                site_name: 'Sadulur Teknologi Indonesia',
                contact_email: 'hello@sadux.id',
                contact_phone: '+6281234567890',
                address: 'Indonesia',
                footer_copyright: '© 2025 Sadulur Teknologi Indonesia.'
            });
            console.log('Settings seeded');
        }

        // Seed FAQs
        const faqCount = await db.Faq.count();
        if (faqCount === 0) {
            await db.Faq.bulkCreate([
                { question: 'What is SaduX?', answer: 'Sadulur Teknologi Indonesia (SaduX) is a software development company providing integrated management solutions.', order: 1 },
                { question: 'Can I customize the POS system?', answer: 'Yes, our POS system is built to be modular and customizable to your specific retail needs.', order: 2 },
                { question: 'Do you offer support for the Tournament platform?', answer: 'Absolutely. We provide full technical support during your events.', order: 3 }
            ]);
            console.log('FAQs seeded');
        }

        // Seed Testimonials
        const testiCount = await db.Testimonial.count();
        if (testiCount === 0) {
            await db.Testimonial.bulkCreate([
                { name: 'John Doe', role: 'CEO, Esport Org', comment: 'The tournament system is flawless. Save us hours of manual work.', rating: 5 },
                { name: 'Jane Smith', role: 'HR Manager', comment: 'SaduX HRIS made payroll day a breeze. Highly recommended.', rating: 5 },
                { name: 'Michael B.', role: 'Retail Owner', comment: 'POS + HR integration is a game changer for my store chains.', rating: 5 }
            ]);
            console.log('Testimonials seeded');
        }

    } catch (error) {
        console.error('Seeding failed:', error);
    }
};

seedAdmin();
