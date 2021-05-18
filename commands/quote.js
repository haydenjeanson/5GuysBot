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

// async function readQuote(db, quotedID, key) {
//     try {
//         const snapshot = await db.collection('users').get();
//         snapshot.forEach((doc) => {
//             console.log(doc.id, '=>', doc.data());
//         });

//         // Function exectuted successfully
//         return true
//     } catch (error) {
//         console.error(error);
//         // Something went wrong
//         return false
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