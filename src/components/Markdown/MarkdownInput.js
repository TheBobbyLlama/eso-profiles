import {
	MDXEditor,
	linkPlugin,
	linkDialogPlugin,
	maxLengthPlugin,
	toolbarPlugin,
	UndoRedo,
	CreateLink,
	BoldItalicUnderlineToggles
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

function MarkDownInput({ label, placeholder, maxLength = 100, value, onChange, dataPath }) {
	const processChange = (v) => {
		if (v !== value) {
			onChange(v, dataPath);
		}
	}

	return <MDXEditor
		placeholder={placeholder}
		contentEditableClassName="markdown-input"
		markdown={value}
		onChange={processChange}
		plugins={[
			maxLengthPlugin(maxLength),
			linkPlugin(),
			linkDialogPlugin(),
			toolbarPlugin({
				toolbarContents: () => {
					return <div className="markdown-toolbar">
						<label>{label}</label>
						<div>
							<BoldItalicUnderlineToggles />
							<CreateLink />
							<UndoRedo />
						</div>
					</div>
				}
			})
		]}
	/>
}

export default MarkDownInput;