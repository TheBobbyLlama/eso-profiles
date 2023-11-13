export function getUrlBase() {
	if ((window.location.host.startsWith("localhost")) || (window.location.host.endsWith(".github.io")))
		return "/eso-profiles";
	else
		return "";
}
  