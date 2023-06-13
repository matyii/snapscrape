const fs = require('fs');
function formatChatMessages(filename, targetUser) {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
  
      try {
        const jsonData = JSON.parse(data);
        if (
          !jsonData.hasOwnProperty('Received Saved Chat History') ||
          !jsonData.hasOwnProperty('Sent Saved Chat History')
        ) {
          throw new Error('Invalid JSON data. Missing expected properties.');
        }
  
        const receivedChatHistory = jsonData['Received Saved Chat History'];
        const sentChatHistory = jsonData['Sent Saved Chat History'];
  
        const fromMessages = receivedChatHistory.filter((message) => {
          return message.From === targetUser;
        });
  
        const toMessages = sentChatHistory.filter((message) => {
          return message.To === targetUser;
        });
  
        const allMessages = [...fromMessages, ...toMessages];
        const sortedMessages = allMessages.sort((a, b) => {
          const dateA = new Date(a.Created);
          const dateB = new Date(b.Created);
          return dateA - dateB;
        });
  
        const formattedMessages = sortedMessages.map((message) => {
          const date = new Date(message.Created);
          const formattedDate = date.toISOString().split('T')[0];
          const formattedTime = date.toLocaleTimeString();
  
          if (message.From === targetUser) {
            return {
              Type: 'From',
              User: targetUser,
              Date: formattedDate,
              Time: formattedTime,
              Text: message.Text,
            };
          } else if (message.To === targetUser) {
            return {
              Type: 'To',
              User: 'You',
              Date: formattedDate,
              Time: formattedTime,
              Text: message.Text,
            };
          }
        });
  
        const result = {
          Messages: formattedMessages,
        };
  
        const jsonString = JSON.stringify(result, null, 2);
  
        fs.writeFile(`uploads/formatted/${targetUser}.json`, jsonString, (err) => {
          if (err) {
            console.error('Error writing to file:', err);
            return;
          }
        });
      } catch (err) {
        console.error('Error processing JSON:', err);
      }
    });
  }
  module.exports = formatChatMessages;