import MarkdownView from "react-showdown";

const charLinkExtension = function () {
	var charLink = {
	  type: 'lang',
	  regex: /{(.+?)}/g,
	  replace: "<a href='/profile/$1' target='_blank'>$1</a>"
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