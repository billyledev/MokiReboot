# Software specifications

This project was developed using the Arduino IDE on a D1 mini v4 board. You will need install the CH340 driver and add the ESP8266 packages in Arduino to use this project. The instructions are available here: [Getting started with D1 mini and Arduino](https://www.wemos.cc/en/latest/tutorials/d1/get_started_with_arduino_d1.html).

## Libraries

You will need to install the following libraries in your Arduino IDE:
- [WifiManager by tzapu](https://github.com/tzapu/WiFiManager)
- [NTPClient by Fabrice Weinberg](https://github.com/arduino-libraries/NTPClient)
- [FastLED by Daniel Garcia](https://github.com/FastLED/FastLED)
- [ESP8266-ping by Alessio Leoncini](https://github.com/bluemurder/esp8266-ping)
- [Adafruit SSD1306 by Adafruit](https://github.com/adafruit/Adafruit_SSD1306)
- [Ticker by Stefan Staub](https://github.com/sstaub/Ticker) (this library conflicts with the default esp8266 Ticker library so the source are already included in the project folder)
