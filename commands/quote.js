module.exports = {
    name: 'quote',
    description: 'Various quote functionality.',
    options: [{
        name: 'add',
        description: 'Add a new quote.',
        type: 1,
        options: [{
            name: 'user',
            type: 'USER',
            description: 'The user who said the quote',
            required: true
        }]
    }],
    async execute(client, interaction) {
        // Send initial defer so that the message doesn't time out if firebase is slow
        interaction.defer();

        // Do the stuff here
        quotedName = (await client.users.fetch('173973392679108619')).username

        // Edit the deffered response
        interaction.editReply((await client.users.fetch('173973392679108619')).username);
    }
}