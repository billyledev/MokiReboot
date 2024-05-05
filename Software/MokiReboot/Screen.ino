Adafruit_SSD1306 display(LCD_WIDTH, LCD_HEIGHT, &Wire);

boolean displayOn = false;

void initDisplay() {
  Wire.begin(LCD_SDA, LCD_SCL, LCD_ADDRESS);

  if (!display.begin(SSD1306_SWITCHCAPVCC, LCD_ADDRESS, false, false)) {
    Serial.println("SSD1306 allocation failed");
    for(;;);
  }

  display.clearDisplay();
  display.drawBitmap(0, 0, mokireboot_logo, LCD_WIDTH, LCD_HEIGHT, SSD1306_WHITE);
  display.display();
}

void startDisplay() {
  displayOn = true;
  display.ssd1306_command(SSD1306_DISPLAYON);
  updateDisplay();
}

void updateDisplay() {
  if (displayOn) {
    char tm[9];
    char dt[11];

    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.cp437(true);

    getTime(tm, sizeof(tm));
    getDate(dt, sizeof(dt));

    display.print("Date: ");
    display.println(tm);
    display.print("      ");
    display.println(dt);
    display.println("");

    getLastRebootTime(tm, sizeof(tm));
    getLastRebootDate(dt, sizeof(dt));

    display.print("Last reboot: ");
    if (rebootCounter == 0) {
      display.println("never");
    } else {
      display.println(tm);
      display.print("           ");
      display.println(dt);
      display.println("");
      display.print("Reboot nb: ");
      display.print(rebootCounter);
    }

    display.display();
  }
}

void stopDisplay() {
  displayOn = false;
  display.ssd1306_command(SSD1306_DISPLAYOFF);
}
