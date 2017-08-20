#include <Stepper.h>
#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN 9 
#define SS_PIN 10
#define START_BUTTON_PIN 8
#define LIMIT_SWITCH_LEFT_PIN 2
#define LIMIT_SWITCH_RIGHT_PIN 3

#define MOTOR_STEPS 200
#define STEPPER_SPEED 75

Stepper stepper(MOTOR_STEPS, 4, 5, 6, 7);
MFRC522 rfid(SS_PIN, RST_PIN);

int dir = 1;
int check = 0;
int limitSwitchLeftState = 0;
int startButtonState = 0;
int limitSwitchRightState = 0;
bool moving = false;

void setup() {
  Serial.begin(9600);   // Initialize serial communications with the PC
  
  stepper.setSpeed(STEPPER_SPEED);
  
  SPI.begin();      // Init SPI bus
  rfid.PCD_Init();   // Init MFRC522
  rfid.PCD_DumpVersionToSerial();  // Show details of PCD - MFRC522 Card Reader details
    
  pinMode(START_BUTTON_PIN, INPUT);
  pinMode(LIMIT_SWITCH_LEFT_PIN, INPUT);
  pinMode(LIMIT_SWITCH_RIGHT_PIN, INPUT);

  startMoving();
}

void loop() {
  if ( check == 100 ) {
    check = 0;
    
    if (rfid.PICC_IsNewCardPresent()) {
      unsigned long uid = getID();
      
      if (uid != -1){
        Serial.print("[UID] "); 
        Serial.println(uid);
        Serial.println();

        if (uid == 4294961722) {
          Serial.println("Special card found: starting to move.");
          startMoving();
        }
      }
    }
  } else {
    check++;
  }

  startButtonState = digitalRead(START_BUTTON_PIN);

  if (startButtonState == HIGH) {
    startMoving();
  }
  
  limitSwitchLeftState = digitalRead(LIMIT_SWITCH_LEFT_PIN);
  limitSwitchRightState = digitalRead(LIMIT_SWITCH_RIGHT_PIN);
  
  if (limitSwitchLeftState == HIGH) {
    stepper.step(MOTOR_STEPS / 100);
    
    stopMoving();
  } else if (limitSwitchRightState == HIGH) {
    stepper.step(-MOTOR_STEPS / 100);
    
    stopMoving();
  } else if (moving) {
    stepper.step(MOTOR_STEPS / 100 * dir);
  }
}

void startMoving() {
  if (moving) {
    return;
  }

  Serial.println("Starting to move...");
  Serial.println("[START_SCAN]"); 
  moving = true;
  
}

void stopMoving() {
  if (!moving) {
    return;
  }
  
  Serial.println("Stopping.");
  Serial.println("[STOP_SCAN]");
  moving = false;
  
  if (dir == -1) {
    dir = 1;
  } else if (dir == 1) {
    dir = -1;
  }
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

