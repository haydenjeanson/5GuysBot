const admin = require('firebase-admin');

/**
 * 
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
 * 
 * @param {FirebaseFirestore.Firestore} db Firebase db connection
 * @param {String} quotedID Optional. The ID of the user who's quote is to be retrieved
 * @param {String} key Optional. A fragment of the quote to be retrieved.
 * @returns 
 */
// async function readQuote(db, quotedID = null, key = null) {
//     try {

//         const docRef = db.collection('users').doc(quotedID);
//         const doc = await docRef.get();
//         if (!doc.exists) {
//             // No such document
//             await docRef.set({
//                 0: quote,
//                 'maxIndex': 0
//             }); 
//         } else {
//             // Retrieve previous maxIndex and increment as we are about to add a new quote.
//             let maxIndex = (await doc.get('maxIndex')) + 1;

//             await docRef.set({
//                 [maxIndex]: quote,
//                 'maxIndex': maxIndex
//             }, { merge: true }); // Merge with the current doc if it already exists instead of overwriting
//         }
    
//         // Function executed successfully
//         return true;
//     } catch (error) {
//         console.error(error);
//         // Something went wrong
//         return false;
//     }    
// }

module.exports = {
    name: 'quote',
    description: 'Various quote functionality.',
    options: [{
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
    }],
    async execute(interaction, client, db) {
        // Send initial defer so that the message doesn't time out if firebase is slow
        interaction.defer();

        // Do the stuff here
        quoteAdded = await addQuote(db, interaction.options[0].options[0].value, interaction.options[0].options[1].value);

        // Edit the deffered response
        if (quoteAdded) {
            interaction.editReply("Quote Added!");
            // followUp with quote that was added
        } else {
            interaction.editReply("Uh Oh! Something went wrong. The quote was not added.");
        }
        
    }
}