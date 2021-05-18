async function addQuote(db, quotedID, quote) {
    try {
        const docRef = db.collection('users').doc(quotedID);

        await docRef.set({
            quote: quote
        });
        // Function exectuted successfully
        return true
    } catch (error) {
        console.error(error);
        // Something went wrong
        return false
    }    
}

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
        quoteAdded = addQuote(db, interaction.options[0].options[0].value, interaction.options[0].options[1].value);

        // Edit the deffered response
        if (quoteAdded) {
            interaction.editReply("Quote Added!");
        } else {
            interaction.editReply("Uh Oh! Something went wrong. The quote was not added.");
        }
        
    }
}