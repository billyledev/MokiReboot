CRGB statusLeds[NB_LEDS];

void initLeds() {
  FastLED.addLeds<WS2812B, STATUS_PIN, GRB>(statusLeds, NB_LEDS);
  FastLED.setBrightness(BRIGHTNESS);

  setUnknownStatus();
}

void setUnknownStatus() {
  statusLeds[0] = CRGB::Black;
  FastLED.show();
  statusLeds[1] = CRGB::Black;
  FastLED.show();
  statusLeds[2] = CRGB::Black;
  FastLED.show();

  statusLeds[0] = CRGB::Indigo;
  FastLED.show();
  statusLeds[1] = CRGB::Indigo;
  FastLED.show();
  statusLeds[2] = CRGB::Indigo;
  FastLED.show();
}

void setConnectedStatus() {
  statusLeds[0] = CRGB::Black;
  FastLED.show();
  statusLeds[1] = CRGB::Black;
  FastLED.show();
  statusLeds[2] = CRGB::Black;
  FastLED.show();

  statusLeds[0] = CRGB::Green;
  FastLED.show();
  statusLeds[1] = CRGB::Green;
  FastLED.show();
  statusLeds[2] = CRGB::Green;
  FastLED.show();
}

void setPingFailedStatus() {
  if (failedPingCounter >= 1) {
    statusLeds[0] = CRGB::Black;
    FastLED.show();
    statusLeds[0] = CRGB::Red;
    FastLED.show();
  }

  if (failedPingCounter >= 2) {
    statusLeds[1] = CRGB::Black;
    FastLED.show();
    statusLeds[1] = CRGB::Red;
    FastLED.show();
  }

  if (failedPingCounter >= 3) {
    statusLeds[2] = CRGB::Black;
    FastLED.show();
    statusLeds[2] = CRGB::Red;
    FastLED.show();
  }
}

void startupLedsAnim() {
  statusLeds[0] = CRGB::Black;
  FastLED.show();
  statusLeds[0] = CRGB::Red;
  FastLED.show();
  delay(500);
  statusLeds[1] = CRGB::Black;
  FastLED.show();
  statusLeds[1] = CRGB::Red;
  FastLED.show();
  delay(500);
  statusLeds[2] = CRGB::Black;
  FastLED.show();
  statusLeds[2] = CRGB::Red;
  FastLED.show();
  delay(1000);
  statusLeds[0] = CRGB::Black;
  FastLED.show();
  statusLeds[0] = CRGB::Green;
  FastLED.show();
  delay(500);
  statusLeds[1] = CRGB::Black;
  FastLED.show();
  statusLeds[1] = CRGB::Green;
  FastLED.show();
  delay(500);
  statusLeds[2] = CRGB::Black;
  FastLED.show();
  statusLeds[2] = CRGB::Green;
  FastLED.show();
  delay(1000);
}
