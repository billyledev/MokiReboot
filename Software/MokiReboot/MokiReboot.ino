#include <SD.h>
#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <FastLED.h>
#include <Pinger.h>
#include <Adafruit_SSD1306.h>
#include "./Ticker.h"

#include "global.h"

Ticker displayOffTimer(stopDisplay, DISPLAY_TIME * SECOND_IN_MILLIS, 1);
Ticker displayUpdateTimer(updateDisplay, 1000);
Ticker pingerTimer(runPing, PING_INTERVAL * MINUTE_IN_MILLIS, 1);
Ticker pingerRetryTimer(runPing, PING_RETRY_INTERVAL * MINUTE_IN_MILLIS, 1);
Ticker routerRestartTimer(runPing, RESTART_TIME * MINUTE_IN_MILLIS, 1);
Ticker autoResetTimer(restart, AUTO_RESET_TIME, 1);

boolean printInfosRequest = false;

unsigned long lastLcdBtnClick;

void restart() {
  ESP.restart();
}

void setup() {
  if (DEBUG) {
    Serial.begin(115200);
    Serial.println("");
  }

  pinMode(LCD_BTN, INPUT_PULLUP);

  pinMode(RELAY_OUT, OUTPUT);
  digitalWrite(RELAY_OUT, LOW);

  initLeds();
  initDisplay();

  setupSD();
  performUpdate();

  connectWiFi();

  connectNTP();

  lastLcdBtnClick = millis();

  startupLedsAnim();

  stopDisplay();

  setUnknownStatus();
  delay(3000);

  autoResetTimer.start();
  displayUpdateTimer.start();
  runPing();
}

void loop() {
  displayOffTimer.update();
  displayUpdateTimer.update();

  pingerTimer.update();
  pingerRetryTimer.update();
  routerRestartTimer.update();

  autoResetTimer.update();

  int lcdBtnState = digitalRead(LCD_BTN);
  if (lcdBtnState == LOW && lastLcdBtnClick + DEBOUNCE_TIME < millis()) {
    lastLcdBtnClick = millis();
    printInfosRequest = true;
  }

  if (printInfosRequest) {
    startDisplay();
    displayOffTimer.start();
    printInfosRequest = false;
  }
}
