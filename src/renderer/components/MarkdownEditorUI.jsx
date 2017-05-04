import React from "react";
import Editor from "./Editor";
import style from "./MarkdownEditorUI.css"

export default class MarkdownEditorUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {text: ""};
        this.onChangeText = this.onChangeText.bind(this);
    }

    onChangeText(e) {
        this.setState({text: e.target.value});
    }

    render() {
        console.log(style);
        return (
            <div className={style.markdownEditor}>
                <Editor
                    className={style.editorArea}
                    value={this.state.text}
                    onChange={this.onChangeText}
                />
            </div>
        );
    }
}