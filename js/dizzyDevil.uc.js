// Ref: https://github.com/aminomancer/uc.css.js/blob/master/JS/aboutCfg.sys.mjs

const registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);

class Page {
	_uri = null;
	QueryInterface = null;
	constructor(uri){
		this._uri = uri;
		this.QueryInterface = ChromeUtils.generateQI(["nsIAboutModule"]);
	}
	get uri() {
		return Services.io.newURI(this._uri);
	}
	newChannel(_, loadInfo) {
		const ch = Services.io.newChannelFromURIWithLoadInfo(this.uri, loadInfo);
		ch.owner = Services.scriptSecurityManager.getSystemPrincipal();
		return ch;
	}
	getURIFlags(_uri) {
		return (
			Ci.nsIAboutModule.ALLOW_SCRIPT | Ci.nsIAboutModule.IS_SECURE_CHROME_UI
		);
	}
	getChromeURI(_uri) {
		return this.uri;
	}
}

class PageFactory {
	QueryInterface = null;
	uri = null;
	constructor(uri){
		this.uri = uri;
		this.QueryInterface = ChromeUtils.generateQI(["nsIFactory"]);
	}
	createInstance(aIID) {
		return (new Page(this.uri)).QueryInterface(aIID);
	}
};

function generateFreeCID() {
	let uuid;
	do {
		uuid = Components.ID(Services.uuid.generateUUID().toString());
	} while (registrar.isCIDRegistered(uuid));
	return uuid;
}

function registerPage(at, uri){
	let factory = new PageFactory(uri);
	registrar.registerFactory(
		generateFreeCID(),
		`about:${at}`,
		`@mozilla.org/network/protocol/about;1?what=${at}`,
		factory
	);
}

registerPage("newtab", "chrome://userchromejs/content/dizzyDevil/dizzyDevil.xhtml");
registerPage("dizzy", "chrome://userchromejs/content/dizzyDevil/dizzyDevil.xhtml");
registerPage("blank", "chrome://userchromejs/content/dizzyDevil/dizzyDevil.xhtml");
registerPage("home", "chrome://userchromejs/content/dizzyDevil/dizzyDevil.xhtml");
registerPage("systemcolors", "chrome://userchromejs/content/systemColors/systemColors.xhtml");
