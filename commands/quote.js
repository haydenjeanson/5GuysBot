const { CommandInteraction, Client } = require('discord.js');
const admin = require('firebase-admin');

/**
 * Adds a quote to the firebase firestore
 * @param {FirebaseFirestore.Firestore} db Firebase db connection
 * @param {String} quotedID The ID of the user who's quote is to be added
 * @param {String} quote The quote to be added
 * @returns {Boolean} true if successfully added, else false
 */
async function addQuote(db, quotedID, quote) {
    try {
        const docRef = db.collection('users').doc(quotedID);
        const doc = await docRef.get();
        if (!doc.exists) {
            // No such document
            await docRef.set({
                0: quote,
                'maxIndex': 0
            });
            
            // Update array of user Ids with new user
            const userIdsRef = db.collection('users').doc('userIds');
            await userIdsRef.update({
                'userIds': admin.firestore.FieldValue.arrayUnion(quotedID)
            });
        } else {
            // Retrieve previous maxIndex and increment as we are about to add a new quote.
            let maxIndex = (await doc.get('maxIndex')) + 1;

            await docRef.set({
                [maxIndex]: quote,
                'maxIndex': maxIndex
            }, { merge: true }); // Merge with the current doc if it already exists instead of overwriting
        }
    
        // Function executed successfully
        return true;
    } catch (error) {
        console.error(error);
        // Something went wrong
        return false;
    }    
}

/**
 * Gets a quote from the firebase firestore
 * @param {Client} client Discord client
 * @param {FirebaseFirestore.Firestore} db Firebase db connection
 * @param {String} quotedID Optional. The ID of the user who's quote is to be retrieved
 * @param {String} key Optional. A fragment of the quote to be retrieved.
 * @returns 
 */
async function getQuote(client, db, quotedID = null, key = null) {
    try {
        let quote = 'A quote could not be found'; // This will get updated when a quote is found
        let randomId = false;

        if (quotedID === null) {
            // Get array of user Ids
            const userIdsRef = db.collection('users').doc('userIds');
            const userIdsDoc = await userIdsRef.get();

            let userIds = await userIdsDoc.get('userIds');
            
            // Select random id from array
            quotedID = userIds[Math.floor(Math.random() * userIds.length)];
            randomId = true;
        }

        // Get document for selected user
        const userDocRef = db.collection('users').doc(quotedID);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            throw `Error (getQuote): Random user doc ${quotedID} does not exist.`;
        } else {
            if (key === null) {
                maxIndex = userDoc.get('maxIndex');
                
                // Get random number between 0 and maxIndex and return the corresponding quote fron selected Id
                randomIndex = Math.floor(Math.random() * maxIndex);

                quoteUser = (await client.users.fetch(quotedID)).username
                quote = userDoc.get(`${randomIndex}`);
            } else {
                let quotes = [[userDoc.id, userDoc.data()]];
                
                if (randomId) {
                    const userRef = db.collection('users');
                    const allUsers = await userRef.get();
                    
                    for (i = 0; i < allUsers.size; i++) {
                        quotes.push([allUsers.docs[i].id, allUsers.docs[i].data()]);
                    }
                }

                quoteInfo = findQuoteByKey(quotes, key);

                quoteUser = (await client.users.fetch(quoteInfo[0])).username;
                quote = quoteInfo[1];

            }
        }
    
        if (quote === undefined) {
            return 'A quote could not be found';
        } else {
            // Add username of quoted person before returning
            quote = `${quoteUser}: ${quote}`;
            return quote;
        }
    } catch (error) {
        console.error(error);
        // Something went wrong
        return 'An unknown error occurred.';
    }    
}

/**
 * Returns a random quote that contains the key from the array of quotes
 * @param {Array} quotes Object of quotes to search through for key
 * @param {String} key String to search for
 */
 function findQuoteByKey(quotes, key) {
    let matches = [];

    quotes.forEach((userQuotes) => {
        let numQuotes = userQuotes[1]['maxIndex'] + 1; // number of quotes needs to add the quote at index 0
        delete userQuotes[1]['maxIndex']; // Remove this from quotes object since its not a quote

        for (i = 0; i < numQuotes; i++) {
            if (userQuotes[1][i].includes(key)) {
                matches.push([userQuotes[0] ,userQuotes[1][i]]);
            }
        }
    })

    let randomQuote = matches[Math.floor(Math.random() * matches.length)];

    return randomQuote;
}

module.exports = {
    name: 'quote',
    description: 'Various quote functionality.',
    options: [
        {
            name: 'add',
            description: 'Add a new quote.',
            type: 1,
            options: [
                {
                    name: 'user',
                    type: 'USER',
                    description: 'The user who said the quote.',
                    required: true
                }, 
                {
                    name: 'quote',
                    type: 'STRING',
                    description: 'The quote.',
                    required: true
                }
            ]
        },
        {
            name: 'show',
            description: 'Shows a quote.',
            type: 1,
            options: [
                {
                    name: 'user',
                    type: 'USER',
                    description: 'The user who said the quote.'
                }, 
                {
                    name: 'key',
                    type: 'STRING',
                    description: 'Part of the quote to look for.'
                }
            ]
        }
    ],
    /**
     * Handler for the quote command and its options.
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @param {FirebaseFirestore.Firestore} db 
     */
    async execute(interaction, client, db) {
        // Send initial defer so that the message doesn't time out if firebase is slow
        interaction.defer();

        if (interaction.options[0].name === 'add') {
            // Do the stuff here
            quoteAdded = await addQuote(db, interaction.options[0].options[0].value, interaction.options[0].options[1].value);

            // Edit the deffered response
            if (quoteAdded) {
                interaction.editReply(`Quote Added!\n${(await client.users.fetch(interaction.options[0].options[0].value)).username}: ${interaction.options[0].options[1].value}`);
            } else {
                interaction.editReply('Uh Oh! Something went wrong. The quote was not added.');
            }
        } else if (interaction.options[0].name === 'show') {
            if (interaction.options[0].options != undefined) {
                if (interaction.options[0].options[0] != undefined) {
                    if (interaction.options[0].options[0].name === 'user') {
                        if (interaction.options[0].options[1] != undefined && interaction.options[0].options[1].name === 'key') {
                            // name and key are present
                            quote = await getQuote(client, db, interaction.options[0].options[0].value, interaction.options[0].options[1].value);
                        } else {
                            // name present, no key
                            quote = await getQuote(client, db, interaction.options[0].options[0].value);
                        }
                    } else if (interaction.options[0].options[0].name === 'key') {
                        // key present, no name
                        quote = await getQuote(client, db, null, interaction.options[0].options[0].value);
                    }
                }
            } else {
                // no name or key
                quote = await getQuote(client, db);
            }

            interaction.editReply(quote);
        }
    }
}