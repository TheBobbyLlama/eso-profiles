import MarkdownView from "react-showdown";
import { getUrlBase } from "../../util";

const charLinkExtension = function () {
	const charLink = {
	  type: 'lang',
	  regex: /{(.+?)}/g,
	  replace: `<a href='${getUrlBase()}/view/$1' target='_blank'>$1</a>`.replace(/\/\//g, "/")
	};
	return [charLink];
}

function CustomMarkdown({text}) {
	return <MarkdownView
		markdown={text}
		extensions={charLinkExtension}
		options={{
			openLinksInNewWindow: true,
		}}
	/>
}

export default CustomMarkdown;