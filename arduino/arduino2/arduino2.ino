/**
  *
 * Typical pin layout used:
 * -----------------------------------------------------------------------------------------
 *             MFRC522      Arduino       Arduino   Arduino    Arduino          Arduino
 *             Reader/PCD   Uno/101       Mega      Nano v3    Leonardo/Micro   Pro Micro
 * Signal      Pin          Pin           Pin       Pin        Pin              Pin
 * -----------------------------------------------------------------------------------------
 * RST/Reset   RST          9             5         D9         RESET/ICSP-5     RST
 * SPI SS 1    SDA(SS)      ** custom, take a unused pin, only HIGH/LOW required **
 * SPI SS 2    SDA(SS)      ** custom, take a unused pin, only HIGH/LOW required **
 * SPI MOSI    MOSI         11 / ICSP-4   51        D11        ICSP-4           16
 * SPI MISO    MISO         12 / ICSP-1   50        D12        ICSP-1           14
 * SPI SCK     SCK          13 / ICSP-3   52        D13        ICSP-3           15
 *
 */

/*  Wiring up the RFID Readers ***
 *  RFID readers based on the Mifare RC522 like this one:  http://amzn.to/2gwB81z
 *  get wired up like this:
 *
 *  RFID pin    Arduino pin (above)
 *  _________   ________
 *  SDA          SDA - each RFID board needs its OWN pin on the arduino
 *  SCK          SCK - all RFID boards connect to this one pin
 *  MOSI         MOSI - all RFID boards connect to this one pin
 *  MISO         MISO - all RFID boards connect to this one pin
 *  IRQ          not used
 *  GND          GND - all RFID connect to GND
 *  RST          RST - all RFID boards connect to this one pin
 *  3.3V         3v3 - all RFID connect to 3.3v for power supply
 *
 */


#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN         9          // Configurable, see typical pin layout above

//each SS_x_PIN variable indicates the unique SS pin for another RFID reader
#define SS_1_PIN        10         // Configurable, take a unused pin, only HIGH/LOW required, must be diffrent to SS 2
#define SS_2_PIN        8          // Configurable, take a unused pin, only HIGH/LOW required, must be diffrent to SS 1
#define SS_3_PIN        4          // Configurable, take a unused pin, only HIGH/LOW required, must be diffrent to SS 1

#define BUTTON_PIN  3   
//must have one SS_x_PIN for each reader connected
#define NR_OF_READERS   3

byte ssPins[] = {SS_1_PIN, SS_2_PIN,SS_3_PIN};

MFRC522 mfrc522[NR_OF_READERS];   // Create MFRC522 instance.
String read_rfid;


/**
 * Initialize.
 */
void setup() {
  
  Serial.begin(9600); // Initialize serial communications with the PC
  while (!Serial);    // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)

  SPI.begin();        // Init SPI bus

  for (uint8_t reader = 0; reader < NR_OF_READERS; reader++) {
    mfrc522[reader].PCD_Init(ssPins[reader], RST_PIN); // Init each MFRC522 card
    Serial.print(F("Reader "));
    Serial.print(reader);
    Serial.print(F(": "));
    mfrc522[reader].PCD_DumpVersionToSerial();
      }
    pinMode(BUTTON_PIN, INPUT);
    digitalWrite(BUTTON_PIN, LOW);
}

/**
 * Main loop.
 */
void loop() {
  
  
  for (uint8_t reader = 0; reader < NR_OF_READERS; reader++) {
    // Look for new cards  
    
          
    //   
    //Serial.println("Reading readers" + String(ValidCardOrder) + "-----" + String(Card_1_ok) + "--" + String(Card_2_ok) + "--" + String(Card_3_ok));   

    if (mfrc522[reader].PICC_IsNewCardPresent() && mfrc522[reader].PICC_ReadCardSerial()) { 

      Serial.print("[READER]"); 
      Serial.print(reader);
      Serial.print("[UID]"); 
        
      dump_byte_array(mfrc522[reader].uid.uidByte, mfrc522[reader].uid.size);
      Serial.print(read_rfid);

      Serial.println();
            
      // Halt PICC
      mfrc522[reader].PICC_HaltA();
      // Stop encryption on PCD
      mfrc522[reader].PCD_StopCrypto1();
    }
    
     } 
     
     Serial.print(F("Button"));
     Serial.println(digitalRead(BUTTON_PIN));
}



void dump_byte_array(byte *buffer, byte bufferSize) {
  read_rfid = "";
  for (byte i = 0; i < bufferSize; i++) {
    read_rfid = read_rfid + String(buffer[i], HEX);
  }
}
