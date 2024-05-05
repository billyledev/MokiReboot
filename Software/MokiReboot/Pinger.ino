Pinger pinger;

int failedPingCounter = 0;
int rebootCounter = 0;

void runPing() {
  if (pinger.Ping(GOOGLE_HOST) == false) {
    if (DEBUG) Serial.println("Error during ping command!");
    failedPingCounter++;
    setPingFailedStatus();

    if (failedPingCounter == 3) {
      failedPingCounter = 0;
      delay(1000);
      setUnknownStatus();
      digitalWrite(RELAY_OUT, HIGH);
      delay(5000);
      digitalWrite(RELAY_OUT, LOW);
      delay(1000);
      rebootCounter++;
      updateLastRebootTime();
      routerRestartTimer.start();
    } else {
      pingerRetryTimer.start();
    }
  } else {
    if (DEBUG) Serial.println("Ping success!");
    failedPingCounter = 0;
    setConnectedStatus();
    pingerTimer.start();
  }
}
