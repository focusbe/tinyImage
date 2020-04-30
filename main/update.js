const autoUpdater = require("electron-updater").autoUpdater;
class Update {
	constructor() {}
	static check() {
		autoUpdater.checkForUpdatesAndNotify()
	}
}
module.exports = Update;
