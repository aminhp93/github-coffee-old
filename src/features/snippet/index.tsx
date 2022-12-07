import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import './index.less';

export default function Snippet() {
  const [text, setText] = useState('');

  const handleClick = async (event: any) => {
    const copyButtonLabel = 'Copy';

    const button = event.srcElement;
    const pre = button.parentElement;
    let code = pre.querySelector('code');
    let text = code.innerText;

    await navigator.clipboard.writeText(text);
    button.innerText = 'Copied';

    setTimeout(() => {
      button.innerText = copyButtonLabel;
    }, 1000);
  };

  const fetchList = async () => {
    const LIST_MARKDOWN_URL: string[] = [];
    const res = await axios({
      method: 'GET',
      url: 'https://api.github.com/repos/aminhp93/terminal-command/git/trees/master?recursive=1',
    });

    if (res && res.data) {
      res.data.tree.forEach((i: any) => {
        if (i.path.includes('.md')) {
          LIST_MARKDOWN_URL.push(
            `https://raw.githubusercontent.com/aminhp93/terminal-command/master/${i.path}`
          );
        }
      });
    }

    if (LIST_MARKDOWN_URL.length === 0) return;

    const listPromises: any = [];
    LIST_MARKDOWN_URL.forEach((i: any) => {
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
    const copyButtonLabel = 'Copy';
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

  useEffect(() => {
    fetch('');
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
