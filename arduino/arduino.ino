#include <Stepper.h>
#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN 9 
#define SS_PIN 10
#define LED_PIN 8
#define LIMIT_SWITCH_PIN 2

#define MOTOR_STEPS 200
#define STEPPER_SPEED 75

Stepper stepper(MOTOR_STEPS, 4, 5, 6, 7);
MFRC522 rfid(SS_PIN, RST_PIN);

int dir = 0;
int check = 0;
int limitSwitchState = 0;

void setup() {
  Serial.begin(9600);   // Initialize serial communications with the PC
  
  stepper.setSpeed(STEPPER_SPEED);
  
  SPI.begin();      // Init SPI bus
  rfid.PCD_Init();   // Init MFRC522
  rfid.PCD_DumpVersionToSerial();  // Show details of PCD - MFRC522 Card Reader details
  
  Serial.println(F("Scan PICC to see UID, SAK, type, and data blocks..."));
  
  pinMode(LED_PIN, OUTPUT);
  pinMode(LIMIT_SWITCH_PIN, INPUT);
}

void loop() {
  if ( check == 100 ) {
    check = 0;
    
    if (rfid.PICC_IsNewCardPresent()) {
      digitalWrite(LED_PIN, HIGH);
    
      unsigned long uid = getID();
      
      if (uid != -1){
        Serial.print("Card detected, UID: "); 
        Serial.println(uid);
  
        if (uid == 4294961722) {
          Serial.println("Moving forward.");
          dir = 1;
        } else if (uid == 4294961210) {
          Serial.println("Moving backward.");
          dir = -1;
        } else {
          Serial.println("Stopping.");
          dir = 0;
        }
  
        Serial.println();
      }
  
      digitalWrite(LED_PIN, LOW);
    }
  } else {
    check++;
  }

  limitSwitchState = digitalRead(LIMIT_SWITCH_PIN);
  
  if (limitSwitchState == HIGH) {
    dir = 0;
    Serial.println("Finished..");
    digitalWrite(LED_PIN, HIGH);
  }
  
  stepper.step(MOTOR_STEPS / 100 * dir);
}

/**
 * rfid.PICC_IsNewCardPresent() should be checked before 
 * @return the card UID
 */
unsigned long getID(){
  if ( ! rfid.PICC_ReadCardSerial()) { //Since a PICC placed get Serial and continue
    return -1;
  }
  unsigned long hex_num;
  hex_num =  rfid.uid.uidByte[0] << 24;
  hex_num += rfid.uid.uidByte[1] << 16;
  hex_num += rfid.uid.uidByte[2] <<  8;
  hex_num += rfid.uid.uidByte[3];
  rfid.PICC_HaltA(); // Stop reading
  return hex_num;
}

void loop2() {
  if ( check == 100 ) {
    check = 0;
    
    if ( rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial() ) {
      digitalWrite(LED_PIN, HIGH);
      //rfid.PICC_DumpToSerial(&(rfid.uid));
      Serial.print(F("In dec: "));
      rfid.PICC_DumpDetailsToSerial(&(rfid.uid));
      Serial.println();
      
      return;
    }
  } else {
    check++;
  }
 
  digitalWrite(LED_PIN, LOW);
  //move();
}

void move() {
  // read the sensor value:
  int sensorReading = analogRead(A0);

  int dir = 1;
  if (sensorReading < 512) {
    dir = -1;
  }
  
  // map it to a range from 0 to 100:
  int motorSpeed = map(abs(sensorReading - 512), 0, 512, 0, 75);
  
  // set the motor speed:
  if (motorSpeed > 10) {
    stepper.setSpeed(motorSpeed);
    // step 1/100 of a revolution:
    stepper.step(MOTOR_STEPS / 100 * dir);
  }
}

/**
 * Helper routine to dump a byte array as dec values to Serial.
 */
void printDec(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], DEC);
  }
}

