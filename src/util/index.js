export function getUrlBase() {
	switch(window.location.host) {
	  case "localhost:3000":
	  case "thebobbyllama.github.io":
		return "/eso-profiles";
	  default:
		return "/";
	}
  }
  