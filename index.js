const vorpal = require('vorpal')();

const { getDbConnection } = require('./src/db');
const { seedDB } = require('./seed');
const { HEADER, CATEGORIES } = require('./src/constants');
const { validateEmail, validatePhoneNumber } = require('./src/utils');

vorpal
    .command('info')
    .description('Mostrar información de los días que estará disponible el MWC.')
    .action((args, callback) => {
        vorpal.log(`El MWC estará abierto el 28 de Febrero, 1 Marzo, 2 Marzo y 3 Marzo`);
        callback();
    });

vorpal
    .command('seed')
    .description('Añade a todos los asistentes por defecto del MWC.')
    .action(async (args, callback) => {
        await seedDB();
        callback();
    });

vorpal
    .command('developers')
    .description('Mostrar la lista de developers que asistirán al MWC.')
    .action(async (args, callback) => {
        const sequelize = await getDbConnection();
        const attending = await sequelize.models.developer.findAll({
            attributes: ['name'],
            raw: true,
        });

        if (attending.length === 0) return vorpal.log(`Parece que nadie va a ir al MWC este año, invita a tus amigos!`);

        if (attending.length === 1) return vorpal.log(`Solo acudirá al MWC este año ${attending[0].name}.`);

        let attendingNames = 'Acudirán al MWC este año:';
        let separator = ',';
        for (const [i, { name }] of attending.entries()) {
            attendingNames += ' ' + name;
            if (i === attending.length - 1) separator = '.';
            if (i === attending.length - 2) separator = ' y';

            attendingNames += separator;
        }

        vorpal.log(attendingNames);
        callback();
    });

vorpal
    .command('addDeveloper')
    .alias('add')
    .description('Añade un developer a la lista de asistentes del MWC.')
    .action(async function (args, callback) {
        const sequelize = await getDbConnection();
        let questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Introduce el nombre del desarrollador: ',
            },
            {
                type: 'input',
                name: 'email',
                message: 'Introduce el correo electrónico del desarrollador: ',
                validate: (email) => {
                    if (validateEmail(email)) return true;
                    return 'Email inválido, por favor, vuélvelo a intentar';
                },
            },
            {
                type: 'list',
                name: 'category',
                message: 'Selecciona la categoría del desarrollador: ',
                choices: [CATEGORIES.BACK, CATEGORIES.DATA, CATEGORIES.FRONT, CATEGORIES.MOBILE],
            },
            {
                type: 'input',
                name: 'phone',
                message: 'Introduce el teléfono del desarrollador: ',
                validate: (phone) => {
                    if (validatePhoneNumber(phone)) return true;
                    return 'Teléfono inválido, por favor, vuélvelo a intentar. (Prueba con 123-456-7890 o (123)456-7890, tiene que estar bien formateado)';
                },
            },
            {
                type: 'list',
                name: 'date',
                message: 'Selecciona la fecha en la que va a asistir el desarrollador: ',
                choices: ['Feb 28, 2021', 'Mar 1, 2021', 'Mar 2, 2021', 'Mar 3, 2021'],
            },
        ];

        return this.prompt(questions, function (answers) {
            answers.date = new Date(answers.date);
            return sequelize.models.developer
                .create(answers)
                .then(() => {
                    vorpal.log('La asistencia de este desarrollador ha sido registrada en la base de datos.');
                    callback();
                })
                .catch((error) => {
                    switch (error.name) {
                        case 'SequelizeUniqueConstraintError':
                            vorpal.log(
                                'Ya teníamos en nuestra base de datos registrada la asistencia de este desarrollador.',
                            );
                            break;

                        default:
                            break;
                    }
                });
        });
    });

if (process.argv) vorpal.parse(process.argv);
else {
    vorpal.log(HEADER, `font-family: monospace`);
    vorpal.delimiter('MWC 22 >>').show();
}
