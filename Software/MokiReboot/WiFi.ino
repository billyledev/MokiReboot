void connectWiFi() {
  WiFiManager wifiManager;
  wifiManager.autoConnect();

  if (DEBUG) {
    Serial.println("WiFi connected!");
  }
}
