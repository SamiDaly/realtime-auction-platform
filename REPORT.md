# 📌 Rättningsrapport – fed25s-the-auction-retry-grupp8

## 🎯 Uppgiftens Krav:
# Gruppuppgift - Auktionsapplikation

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
- Inloggning av användare med hjälp av cookies
- Registering av användare

Om ca 85% av kraven är uppfyllda anses uppgiften vara godkänd. 
Om ett bra försök har gjorts för att implementera inloggning räcker det. Denna klass är frontendutvecklare, inte backendutvecklare. 

## 🔍 ESLint-varningar:
- /app/repos/fed25s-the-auction-retry-grupp8/frontend/src/main.ts - no-console - Unexpected console statement.

## 🏆 **Betyg: G**
📌 **Motivering:** Teknisk analys genomförd men JSON-parsning misslyckades

💡 **Förbättringsförslag:**  
Kontrollera kodkvalitet och kravuppfyllelse manuellt

## 👥 Gruppbidrag

| Deltagare | Antal commits | Commit % | Uppgiftskomplettering | Totalt bidrag |
| --------- | -------------- | -------- | ---------------------- | ------------- |
| Andrea Vilselius | 53 | 52% | 0.33 | 0.41 |
| Sami Daly | 27 | 26.5% | 0.33 | 0.31 |
| Lisa Lodin | 22 | 21.6% | 0.33 | 0.29 |


### 📊 Förklaring
- **Antal commits**: Antalet commits som personen har gjort
- **Commit %**: Procentuell andel av totala commits
- **Uppgiftskomplettering**: Poäng baserad på mappning av README-krav mot kodbidrag 
- **Totalt bidrag**: Viktad bedömning av personens totala bidrag (40% commits, 60% uppgiftskomplettering)
