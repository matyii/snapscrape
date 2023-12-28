const fs = require('fs');

function formatChatMessages(data, targetUser) {
    try {
        if (!data || typeof data !== 'object' || !data[targetUser]) {
            throw new Error('Invalid or missing messages for the specified user.');
        }

        const messages = data[targetUser];
        if (!Array.isArray(messages)) {
            throw new Error('Invalid messages format for the specified user.');
        }

        const formattedMessages = messages.map((message) => {
            const formattedDate = new Date(message.Created);
            const formattedDateString = formattedDate.toISOString().split('T')[0];
            const formattedTime = formattedDate.toLocaleTimeString();

            const messageUser = message.IsSender ? 'You' : targetUser;

            return {
                Type: message['Media Type'],
                User: messageUser,
                Date: formattedDateString,
                Time: formattedTime,
                Text: message.Content || '', // Adjust accordingly if the 'Content' is null
            };
        });

        const result = {
            Messages: formattedMessages,
        };

        const jsonString = JSON.stringify(result, null, 2);
        const filePath = `uploads/formatted/${targetUser}.json`;

        fs.writeFile(filePath, jsonString, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
        });
    } catch (err) {
        console.error('Error processing messages:', err);
    }
}

module.exports = formatChatMessages;
