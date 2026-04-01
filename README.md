# Gruppuppgift - En auktion

Ni skall skapa en auktion-applikation med hjälp av websockets. En användare skall kunna registrera sig på sidan och sedan kunna skapa en (eller flera) auktion(er). En auktion är en sida som använder sig av websockets för att skicka bud och hålla reda på när auktionen går ut. 

En användare måste vara inloggad för att kunna använda någon del av systemet.

## Api:t

Ni skall bygga ett api med hjälp av node.js och express. Denna gång skall ni implementera websocket för att skapa en realtidskommunikation mellan servern och klienten. 

Api:t skall ta emot anrop för att skapa en auktion och kunna ta emot bud samt hålla reda på när auktionen är slut och vem som vann.  

En användare skall kunna logga in. Detta betyder att ni behöver lagra användare i databasen så att ni kan slå upp dessa och logga in vid behov. 

Ni behöver även kunna registrera användare. 

## Klienten

Det finns ett projekt för er frontend i denna mall. Ni behöver göra det minsta möjliga i detta projekt för att få er auktions-site att fungera. 

Klienten behöver även ha funktioner för att registrera användare och logga in användare. 

## Betyg G

- Ett api med node.js och express
- Websockets är implementerat
- Bra kodstruktur för websockets
- Hantering av rum för websockets
- En användare kan skapa en auktion
- En användare kan lägga bud på en auktion (inte sin egen dock)
- En användare kan se information om pågående auktion genom att gå in på auktions-sidan.
- Inloggning av användare (cookies)
- Registering av användare
