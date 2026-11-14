*** 🔥 โค้ดฝั่ง MASTER ***
# MAX Address 
# uint8_t slaveAddress[] = {0x24, 0x6F, 0x28, 0xAA, 0x92, 0x48};

# (Heltec LoRa32 V3)
 
#include <Wire.h>
#include <U8g2lib.h>
#include <WiFi.h>
#include <esp_now.h>

#define VEXT_PIN 36
#define SDA_PIN 17
#define SCL_PIN 18
#define OLED_RST 21

U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, OLED_RST);

uint8_t slaveAddress[] = {0x24, 0x6F, 0x28, 0xAA, 0x92, 0x48};

typedef struct {
  char message[32];
} struct_message;

struct_message myData;

String sendStatus = "Waiting...";

// :white_check_mark: ใช้แบบนี้กับ Heltec core
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  if (status == ESP_NOW_SEND_SUCCESS)
    sendStatus = "Send: OK";
  else
    sendStatus = "Send: FAIL";
}

void setup() {
  Serial.begin(115200);

  // เปิดไฟ OLED
  pinMode(VEXT_PIN, OUTPUT);
  digitalWrite(VEXT_PIN, LOW);
  delay(200);

  Wire.begin(SDA_PIN, SCL_PIN);
  u8g2.begin();

  // WiFi
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(200);

  if (esp_now_init() != ESP_OK) {
    Serial.println("ESP-NOW Init Failed");
    return;
  }

  esp_now_register_send_cb(OnDataSent);

  esp_now_peer_info_t peerInfo = {};
  memcpy(peerInfo.peer_addr, slaveAddress, 6);
  peerInfo.channel = 0;
  peerInfo.encrypt = false;

  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Add Peer Failed");
    return;
  }

  Serial.println("Master Ready");
}

void loop() {

  strcpy(myData.message, "Hello from Master");
  esp_now_send(slaveAddress, (uint8_t *)&myData, sizeof(myData));

  Serial.print("Connect:");
  Serial.println(sendStatus.c_str());

  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_ncenB14_tr);
  u8g2.drawStr(0, 20, "Master-LoRa");
  u8g2.setFont(u8g2_font_6x12_tr);
  u8g2.drawStr(0, 45, sendStatus.c_str());
  u8g2.sendBuffer();

  delay(2000);
}
 
*** 🔥 โค้ดฝั่ง SLAVE ไม่มีวัดระยะทาง ***
# (ESP32 Dev Module)

#include <WiFi.h>
#include <esp_now.h>

// โครงสร้างต้องเหมือน Master
typedef struct struct_message {
  char message[32];
} struct_message;

struct_message incomingData;

void OnDataRecv(const esp_now_recv_info * info, const uint8_t *data, int len) {
  memcpy(&incomingData, data, sizeof(incomingData));

  Serial.print("Received: ");
  Serial.println(incomingData.message);
}

void setup() {
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);

  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  esp_now_register_recv_cb(OnDataRecv);

  Serial.println("Slave Ready");
}

void loop() {
}