import {
	MDXEditor,
	headingsPlugin,
	imagePlugin,
	linkPlugin,
	linkDialogPlugin,
	listsPlugin,
	maxLengthPlugin,
	quotePlugin,
	thematicBreakPlugin,
	toolbarPlugin,
	UndoRedo,
	CreateLink,
	BoldItalicUnderlineToggles,
	InsertImage,
	InsertThematicBreak
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

function MarkdownTextArea({ placeholder, maxLength = 1000, value, onChange, dataPath }) {
	const processChange = (v) => {
		if (v !== value) {
			onChange(v, dataPath);
		}
	}

	return <MDXEditor
		placeholder={placeholder}
		contentEditableClassName="markdown-textarea"
		markdown={value}
		onChange={processChange}
		plugins={[
			maxLengthPlugin(maxLength),
			headingsPlugin(),
			imagePlugin(),
			linkPlugin(),
			linkDialogPlugin(),
			listsPlugin(),
			quotePlugin(),
			thematicBreakPlugin(),
			toolbarPlugin({
				toolbarContents: () => {
					return <div className="markdown-toolbar">
						<div>
							<BoldItalicUnderlineToggles />
							<CreateLink />
							<InsertImage />
							<InsertThematicBreak />
							<UndoRedo />
						</div>
					</div>
				}
			})
		]}
	/>
}

export default MarkdownTextArea;