#include <WiFi.h>
#include <esp_now.h>

uint8_t masterAddress[] = {0xXX,0xXX,0xXX,0xXX,0xXX,0xXX};

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
