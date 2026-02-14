# *** CODE มีการวัดระยะทาง ***

*** 🔥Lo-Ra-32 Master ***
# มีวัดระยะทางไปไกลสุด 95-dbm จาก google map เสถียร 30-35ม หลุดเเต่ยังต่อได้ 60-65 ม 
# MAX Address 
# uint8_t slaveAddress[] = {0x24, 0x6F, 0x28, 0xAA, 0x92, 0x48};
# (Heltec LoRa32 V3)

#include <Wire.h>
#include <U8g2lib.h>
#include <WiFi.h>
#include <esp_now.h>
#include <math.h>

#define VEXT_PIN 36
#define SDA_PIN 17
#define SCL_PIN 18
#define OLED_RST 21

U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, OLED_RST);

float estimatedDistance = 0;
int lastRSSI = 0;

unsigned long lastReceiveTime = 0;
bool connected = false;

// ===== Receive Callback =====
void OnDataRecv(const esp_now_recv_info_t *info,
                const uint8_t *data,
                int len) {

  lastReceiveTime = millis();
  connected = true;

  lastRSSI = info->rx_ctrl->rssi;
  estimatedDistance = pow(10.0, ((-lastRSSI - 40.0) / 20.0));

  // 🔥 ถ้า peer ยังไม่มี ให้ add ก่อน
  if (!esp_now_is_peer_exist(info->src_addr)) {
    esp_now_peer_info_t peerInfo = {};
    memcpy(peerInfo.peer_addr, info->src_addr, 6);
    peerInfo.channel = 0;
    peerInfo.encrypt = false;
    esp_now_add_peer(&peerInfo);
  }

  // 🔥 ส่ง echo กลับ
  esp_now_send(info->src_addr, data, len);

  Serial.print("RSSI: ");
  Serial.print(lastRSSI);
  Serial.print("  Distance: ");
  Serial.println(estimatedDistance);
}

void setup() {
  Serial.begin(115200);

  pinMode(VEXT_PIN, OUTPUT);
  digitalWrite(VEXT_PIN, LOW);
  delay(200);

  Wire.begin(SDA_PIN, SCL_PIN);
  u8g2.begin();

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(200);

  if (esp_now_init() != ESP_OK) {
    Serial.println("ESP-NOW Init Failed");
    return;
  }

  esp_now_register_recv_cb(OnDataRecv);

  Serial.println("Master Ready");
}

void loop() {

  if (millis() - lastReceiveTime > 3000) {
    connected = false;
  }

  u8g2.clearBuffer();

  u8g2.setFont(u8g2_font_ncenB14_tr);
  u8g2.drawStr(0, 18, "MASTER");

  u8g2.setFont(u8g2_font_6x12_tr);

  if (connected)
    u8g2.drawStr(0, 35, "Status: Connected");
  else
    u8g2.drawStr(0, 35, "Status: Disconnected");

  char rssiBuf[20];
  sprintf(rssiBuf, "RSSI: %d dBm", lastRSSI);
  u8g2.drawStr(0, 50, rssiBuf);

  u8g2.sendBuffer();

  delay(300);
}

*** ESP32 ***
# มีวัดระยะทางไปไกลสุด 95-dbm จาก google map เสถียร 30-35ม หลุดเเต่ยังต่อได้ 60-65 ม #

# ESP32 ESP Dev Module 
# ESP32 Board MAC Address: 24:6F:28:AA:92:48
# (ESP32 Dev Module)

#include <WiFi.h>
#include <esp_now.h>

uint8_t masterAddress[] = {0x48,0xCA,0x43,0x3C,0xC4,0x78};

typedef struct {
  int ping;
} struct_message;

struct_message myData;

unsigned long lastReceiveTime = 0;
bool connected = false;

// ✅ รูปแบบใหม่สำหรับ Core 3.x
void OnDataRecv(const esp_now_recv_info_t *info,
                const uint8_t *data,
                int len) {

  lastReceiveTime = millis();
  connected = true;

  Serial.print("Reply from: ");
  Serial.println(info->src_addr[0], HEX);  // ดู MAC ตัวแรกเฉย ๆ
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();

  if (esp_now_init() != ESP_OK) {
    Serial.println("ESP-NOW Init Failed");
    return;
  }

  esp_now_register_recv_cb(OnDataRecv);

  esp_now_peer_info_t peerInfo = {};
  memcpy(peerInfo.peer_addr, masterAddress, 6);
  peerInfo.channel = 0;
  peerInfo.encrypt = false;

  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Add Peer Failed");
    return;
  }
}

void loop() {

  myData.ping = 1;
  esp_now_send(masterAddress, (uint8_t *)&myData, sizeof(myData));

  if (millis() - lastReceiveTime > 3000) {
    connected = false;
  }

  if (connected)
    Serial.println("Status: Connected");
  else
    Serial.println("Status: Disconnected");

  delay(1000);
}