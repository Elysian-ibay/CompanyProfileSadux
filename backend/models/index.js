const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const LandingPageContent = require('./LandingPageContent');
const Feature = require('./Feature');
const Statistic = require('./Statistic');
const Testimonial = require('./Testimonial');
const Faq = require('./Faq');
const GeneralSetting = require('./GeneralSetting');
const Visitor = require('./Visitor');

const db = {
    sequelize,
    User,
    Product,
    LandingPageContent,
    Feature,
    Statistic,
    Testimonial,
    Faq,
    GeneralSetting,
    Visitor
};

module.exports = db;
