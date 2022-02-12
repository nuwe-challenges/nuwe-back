const { expect } = require('chai');
const rimraf = require('rimraf');

const cmd = require('../utils/cmd');

describe('The MWC22 CLI', () => {
    it('should print the correct info', async () => {
        const processCall = cmd.create('./index.js');

        const res = await processCall.execute(['info']);
        expect(res).to.equal('El MWC estará abierto el 28 de Febrero, 1 Marzo, 2 Marzo y 3 Marzo\n');
    });
    it('should remove the prod db and seed it with the base data', async () => {
        rimraf.sync('database.sqlite');
        const seedCall = cmd.create('./index.js');

        const seed = await seedCall.execute(['seed']);
        expect(seed).to.contain('Seed finished successfully');

        const secondSeedCall = cmd.create('./index.js');

        const secondSeed = await secondSeedCall.execute(['seed']);
        expect(secondSeed).to.contain('Seed finished successfully');

        expect(seed).to.contain('Inserting 100 members...');
        expect(secondSeed).not.to.contain('Inserting');
    });

    it('should check if after calling seed the default developer list is inserted', async () => {
        rimraf.sync('database.sqlite');
        const seedCall = cmd.create('./index.js');

        const res = await seedCall.execute(['seed']);
        expect(res).to.contain('Seed finished successfully');

        const developersCall = cmd.create('./index.js');

        const developers = await developersCall.execute(['developers']);
        expect(developers).to.equal(
            `Acudirán al MWC este año: Harrison Edwards, Lester Sampson, Hoyt Fisher, Alyssa Mcgee, Xaviera Dorsey, Alea Sargent, Ralph York, Kieran Cash, James Abbott, Priscilla Hall, Ignacia Hyde, Basia Hartman, Hamilton Tyson, Vera Bowen, Cara Perkins, Kylan Walter, Christopher Reese, Orli Kramer, Quon Patterson, Britanni Castaneda, Shaeleigh Chambers, Serena Shelton, Jael Branch, Nichole Ochoa, Igor Clemons, Rhona Cervantes, Hyacinth Craig, Knox Duncan, Leonard Frederick, Ulric Ramos, Donovan Crane, Igor Lambert, Mikayla Tyler, Jason Shields, Faith Simpson, Rinah Romero, Abbot Leonard, Jeremy Britt, Eleanor Foster, Paloma Love, Davis Hoffman, Eleanor Dunlap, Faith Neal, Fletcher Kerr, Reed Horn, Jaquelyn Ayers, Chiquita Noel, Simone Sparks, Kevyn Pace, Mariko Cobb, Joel Mays, Stephanie Gregory, Jenna Hammond, Abigail Stafford, Jasmine Weaver, Marcia Pratt, Sigourney Herrera, Joseph Mckay, Jonas Wolfe, Xaviera Mcfadden, Keane Chavez, Joseph Shannon, Brock Mullins, Jessamine Mccarthy, Raja Campbell, Tyrone Clark, Curran Higgins, Bruno Figueroa, Maile Macdonald, Angela Holt, Lyle Knowles, Ori Farmer, Drake Carson, Magee Roach, Tarik Harmon, Cade Tran, Rowan Hubbard, Emi Guzman, Colby Dean, Christian Johnson, Aquila Palmer, Tad Landry, Asher Stanley, Aspen Torres, Amena Rowe, Zahir Bonner, Leslie Hewitt, Daquan Gibson, Ima Ramsey, Tanek Charles, Bevis Hunter, Harriet Roy, Marcia Bird, Cora Chen, Geraldine Snow, Rahim O'donnell, Rudyard Sawyer, Cameran Daniels, Galvin Figueroa y Imelda Mack.\n`,
        );
    });
});
