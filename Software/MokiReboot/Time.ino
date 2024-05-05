WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

time_t lastRebootTime;

void connectNTP() {
  timeClient.begin();

  // Paris time is UTC+2
  timeClient.setTimeOffset(2 * HOUR_IN_SECONDS);

  timeClient.update();

  updateLastRebootTime();
}

void updateLastRebootTime() {
  lastRebootTime = timeClient.getEpochTime();
}

// hh:mm:ss
void getTime(char *outTime, int size) {
  time_t epochTime = timeClient.getEpochTime();
  struct tm *ptm = gmtime(&epochTime);
  strftime(outTime, size, "%H:%M:%S", ptm);
}

// dd/MM/yyyy
void getDate(char *outDate, int size) {
  time_t epochTime = timeClient.getEpochTime();
  struct tm *ptm = gmtime(&epochTime);
  strftime(outDate, size, "%d/%m/%Y", ptm);
}

// hh:mm:ss
void getLastRebootTime(char *outTime, int size) {
  struct tm *ptm = gmtime(&lastRebootTime);
  strftime(outTime, size, "%H:%M:%S", ptm);
}

// dd/MM/yyyy
void getLastRebootDate(char *outDate, int size) {
  struct tm *ptm = gmtime(&lastRebootTime);
  strftime(outDate, size, "%d/%m/%Y", ptm);
}
