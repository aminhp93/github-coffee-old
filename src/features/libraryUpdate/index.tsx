import * as React from 'react';
import ReactMarkdown from 'react-markdown';

export interface IProps {}

const text1 = `
// Before
import { render } from "react-dom";
 
const container = document.getElementById("app");
render(<App tab="home" />, container);
`;

const text2 = `
// After
import { createRoot } from "react-dom/client";
 
const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App tab="home" />);
`;

export default function LibraryUpdate(props: IProps) {
  return (
    <div className="flex">
      <div className="flex-1">
        <ReactMarkdown children={text1} />
      </div>
      <div className="flex-1">
        <ReactMarkdown children={text2} />
      </div>
    </div>
  );
}
