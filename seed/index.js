const log = require('log4js').getLogger('seed');
log.level = 'info';

const { getDbConnection } = require('../src/db');
const developers = require('../resources/mwc22.json');
const { Op } = require('sequelize');

async function seedDB() {
    log.info('Seed starting...');
    const sequelize = await getDbConnection();

    const emailsToInsert = [];

    for (const developer of developers) {
        developer.date = new Date(developer.date);
        emailsToInsert.push(developer.email);
    }
    const registeredEmails = await sequelize.models.developer.findAll({
        attributes: ['email'],
        where: {
            email: {
                [Op.in]: emailsToInsert,
            },
        },
        raw: true,
    });

    const registeredEmailsArray = registeredEmails.map((v) => v.email);

    if (registeredEmailsArray.length !== emailsToInsert.length) {
        const notPresentDevelopers = developers.filter((developer) => {
            return !registeredEmailsArray.includes(developer.email);
        });
        log.info(
            `Inserting ${notPresentDevelopers.length} ${notPresentDevelopers.length === 1 ? 'member' : 'members'}...`,
        );
        await sequelize.models.developer.bulkCreate(notPresentDevelopers);
    }

    log.info('Seed finished successfully');
}

module.exports = { seedDB };
