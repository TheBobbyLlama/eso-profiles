import MarkdownView from "react-showdown";
import { getUrlBase } from "../../util";

const charLinkExtension = function () {
	var charLink = {
	  type: 'lang',
	  regex: /{(.+?)}/g,
	  replace: `<a href='${getUrlBase()}/view/$1' target='_blank'>$1</a>`.replace(/\/\//g, "/")
	};
	return [charLink];
}

function CustomMarkdown({markdown}) {
	return <MarkdownView
		markdown={markdown}
		extensions={charLinkExtension}
		options={{
			openLinksInNewWindow: true,
		}}
	/>
}

export default CustomMarkdown;