import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import './index.less';

const LIST_MARKDOWN_URL = [
  'https://raw.githubusercontent.com/aminhp93/terminal-command/master/aws-system-service.md',
  'https://raw.githubusercontent.com/aminhp93/terminal-command/master/common.md',
  'https://raw.githubusercontent.com/aminhp93/terminal-command/master/nginx.md',
  'https://raw.githubusercontent.com/aminhp93/terminal-command/master/postgres.md',
  'https://raw.githubusercontent.com/aminhp93/terminal-command/master/setup-new-ec2.md',
];

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
