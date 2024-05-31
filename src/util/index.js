export function getUrlBase() {
	if ((window.location.host.startsWith("localhost")) || (window.location.host.endsWith(".github.io")))
		return "/eso-profiles";
	else
		return "";
}

/// Adds HTML encoding to a given string.
export function htmlEncode(name) {
	if (!name) return "";

	return name.replace(/[&<>'"]/g, function(match) {
		switch (match)
		{
			case "&":
				return "&amp;";
			case "<":
				return "&lt;";
			case ">":
				return "&gt;";
			case "'":
				return "&apos;";
			case "\"":
				return "&quot;";
			default:
				return "[ENCODING ERROR!]"
		}
	})
}

/// Removes HTML encoding from a given string.
export function htmlDecode(name) {
	if (!name) return "";

	return name.replace(/&amp;|&lt;|&gt;|&apos;|&#39;|&quot;/g, function (match) {
		switch (match)
		{
			case "&amp;":
				return "&";
			case "&lt;":
				return "<";
			case "&gt;":
				return ">";
			case "&apos;":
			case "&#39;":
				return "'";
			case "&quot;":
				return "\"";
			default:
				return "[DECODING ERROR!]"
		}
	})
}