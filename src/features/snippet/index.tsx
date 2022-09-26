import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import copyToClipboard from './files/javascript/copyToClipboard.md';
// import CSVToArray from './files/javascript/CSVToArray.md';
import errorDatabase from './files/common/errorDatabase.md';
import terminal from './files/common/terminal.md';

import './index.less';

export default function Snippet() {
  console.log('Snippet');
  const [text, setText] = useState('');

  const handleClick = async (event: any) => {
    const copyButtonLabel = 'Copy Code';

    const button = event.srcElement;
    const pre = button.parentElement;
    let code = pre.querySelector('code');
    let text = code.innerText;

    await navigator.clipboard.writeText(text);
    button.innerText = 'Code Copied';

    setTimeout(() => {
      button.innerText = copyButtonLabel;
    }, 1000);
  };

  const fetchList = () => {
    const listPromises: any = [];
    [terminal, errorDatabase, copyToClipboard].map((i: any) => {
      listPromises.push(fetch(i).then((res) => res.text()));
    });
    Promise.all(listPromises)
      .then((res) => {
        if (res) {
          setText(res.join(''));
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    let blocks = document.querySelectorAll('pre');
    const copyButtonLabel = 'Copy Code';
    blocks.forEach((block) => {
      // only add a button if browser supports Clipboard API
      if (navigator.clipboard) {
        let button = document.createElement('button');
        button.innerText = copyButtonLabel;
        button.className = 'copy-button';
        button.addEventListener('click', handleClick);
        block.appendChild(button);
      }
    });
  }, [text]);

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div
      className="Snippet height-100 width-100"
      style={{ background: 'white' }}
    >
      <ReactMarkdown children={text} />
    </div>
  );
}
