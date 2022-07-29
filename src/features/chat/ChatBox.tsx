import React from 'react';
import './ChatBox.css';

interface IProps {
  text: string;
  username: string;
  handleTextChange: any;
}

const ChatBox = ({ text, username, handleTextChange }: IProps) => (
  <div>
    <div className="row">
      <div className="col-xs-12">
        <div className="chat">
          <div className="col-xs-5 col-xs-offset-3">
            <input
              type="text"
              value={text}
              placeholder="chat here..."
              className="form-control"
              onChange={handleTextChange}
              onKeyDown={handleTextChange}
            />
          </div>
          <div className="clearfix"></div>
        </div>
      </div>
    </div>
  </div>
);

export default ChatBox;
