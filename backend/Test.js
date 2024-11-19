// {
//     "info": {
//       "name": "Chat System Tests",
//       "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
//     },
//     "item": [
//       {
//         "name": "1. User Authentication",
//         "item": [
//           {
//             "name": "Register User 1",
//             "request": {
//               "method": "POST",
//               "url": "{{baseUrl}}/api/v1/auth/register",
//               "header": [
//                 {
//                   "key": "Content-Type",
//                   "value": "application/json"
//                 }
//               ],
//               "body": {
//                 "mode": "raw",
//                 "raw": {
//                   "name": "John Doe",
//                   "email": "john@example.com",
//                   "password": "123456"
//                 }
//               }
//             }
//           },
//           {
//             "name": "Register User 2",
//             "request": {
//               "method": "POST",
//               "url": "{{baseUrl}}/api/v1/auth/register",
//               "header": [
//                 {
//                   "key": "Content-Type",
//                   "value": "application/json"
//                 }
//               ],
//               "body": {
//                 "mode": "raw",
//                 "raw": {
//                   "name": "Jane Smith",
//                   "email": "jane@example.com",
//                   "password": "123456"
//                 }
//               }
//             }
//           },
//           {
//             "name": "Login User 1",
//             "request": {
//               "method": "POST",
//               "url": "{{baseUrl}}/api/v1/auth/login",
//               "header": [
//                 {
//                   "key": "Content-Type",
//                   "value": "application/json"
//                 }
//               ],
//               "body": {
//                 "mode": "raw",
//                 "raw": {
//                   "email": "john@example.com",
//                   "password": "123456"
//                 }
//               }
//             }
//           },
//           {
//             "name": "Login User 2",
//             "request": {
//               "method": "POST",
//               "url": "{{baseUrl}}/api/v1/auth/login",
//               "header": [
//                 {
//                   "key": "Content-Type",
//                   "value": "application/json"
//                 }
//               ],
//               "body": {
//                 "mode": "raw",
//                 "raw": {
//                   "email": "jane@example.com",
//                   "password": "123456"
//                 }
//               }
//             }
//           }
//         ]
//       },
//       {
//         "name": "2. Chat Operations",
//         "item": [
//           {
//             "name": "Search Users",
//             "request": {
//               "method": "GET",
//               "url": "{{baseUrl}}/api/v1/chat/users/search?term=jane",
//               "header": [
//                 {
//                   "key": "Authorization",
//                   "value": "Bearer {{user1Token}}"
//                 }
//               ]
//             }
//           },
//           {
//             "name": "Create Private Chat",
//             "request": {
//               "method": "POST",
//               "url": "{{baseUrl}}/api/v1/chat/private",
//               "header": [
//                 {
//                   "key": "Authorization",
//                   "value": "Bearer {{user1Token}}"
//                 },
//                 {
//                   "key": "Content-Type",
//                   "value": "application/json"
//                 }
//               ],
//               "body": {
//                 "mode": "raw",
//                 "raw": {
//                   "participantId": "{{user2Id}}"
//                 }
//               }
//             }
//           },
//           {
//             "name": "Get User Chats",
//             "request": {
//               "method": "GET",
//               "url": "{{baseUrl}}/api/v1/chat/user-chats",
//               "header": [
//                 {
//                   "key": "Authorization",
//                   "value": "Bearer {{user1Token}}"
//                 }
//               ]
//             }
//           },
//           {
//             "name": "Create Group Chat",
//             "request": {
//               "method": "POST",
//               "url": "{{baseUrl}}/api/v1/chat/group",
//               "header": [
//                 {
//                   "key": "Authorization",
//                   "value": "Bearer {{user1Token}}"
//                 },
//                 {
//                   "key": "Content-Type",
//                   "value": "application/json"
//                 }
//               ],
//               "body": {
//                 "mode": "raw",
//                 "raw": {
//                   "name": "Test Group",
//                   "participantIds": ["{{user2Id}}"]
//                 }
//               }
//             }
//           }
//         ]
//       },
//       {
//         "name": "3. Messages",
//         "item": [
//           {
//             "name": "Send Text Message",
//             "request": {
//               "method": "POST",
//               "url": "{{baseUrl}}/api/v1/chat/messages",
//               "header": [
//                 {
//                   "key": "Authorization",
//                   "value": "Bearer {{user1Token}}"
//                 },
//                 {
//                   "key": "Content-Type",
//                   "value": "application/json"
//                 }
//               ],
//               "body": {
//                 "mode": "raw",
//                 "raw": {
//                   "chatRoomId": "{{privateChatId}}",
//                   "content": "Hey, this is a test message from John!"
//                 }
//               }
//             }
//           },
//           {
//             "name": "Get Chat Messages",
//             "request": {
//               "method": "GET",
//               "url": "{{baseUrl}}/api/v1/chat/messages/{{privateChatId}}",
//               "header": [
//                 {
//                   "key": "Authorization",
//                   "value": "Bearer {{user1Token}}"
//                 }
//               ]
//             }
//           },
//           {
//             "name": "Send Message with File",
//             "request": {
//               "method": "POST",
//               "url": "{{baseUrl}}/api/v1/chat/messages",
//               "header": [
//                 {
//                   "key": "Authorization",
//                   "value": "Bearer {{user1Token}}"
//                 }
//               ],
//               "body": {
//                 "mode": "formdata",
//                 "formdata": [
//                   {
//                     "key": "chatRoomId",
//                     "value": "{{privateChatId}}"
//                   },
//                   {
//                     "key": "content",
//                     "value": "Here's a test file from John!"
//                   },
//                   {
//                     "key": "files",
//                     "type": "file",
//                     "src": "/path/to/test-file.txt"
//                   }
//                 ]
//               }
//             }
//           }
//         ]
//       }
//     ],
//     "variable": [
//       {
//         "key": "baseUrl",
//         "value": "http://localhost:5001"
//       },
//       {
//         "key": "user1Token",
//         "value": ""
//       },
//       {
//         "key": "user2Token",
//         "value": ""
//       },
//       {
//         "key": "user1Id",
//         "value": ""
//       },
//       {
//         "key": "user2Id",
//         "value": ""
//       },
//       {
//         "key": "privateChatId",
//         "value": ""
//       }
//     ]
//   }